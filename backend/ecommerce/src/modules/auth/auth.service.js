import jwt from 'jsonwebtoken';

import { env, isProduction } from '../../config/env.js';
import { AppError } from '../../shared/AppError.js';
import { comparePassword, hashPassword } from '../../shared/password.js';
import { sendPasswordResetEmail } from '../../shared/mailer.js';
import * as userRepository from '../users/users.repository.js';
import { toUserDTO } from '../users/users.mapper.js';
import { validateUserPayload } from '../users/users.validation.js';

const RESET_TOKEN_TYPE = 'password-reset';

/**
 * O token de redefinição é assinado com um segredo que inclui o hash atual
 * da senha do usuário. Quando a senha muda, qualquer token antigo deixa de
 * ser válido — efeito de "uso único".
 */
function resetTokenSecret(senhaHash) {
  return `${env.jwt.secret}${senhaHash}`;
}

/**
 * Gera um token JWT assinado contendo o id, o e-mail e o perfil do usuário.
 */
function generateToken(user) {
  return jwt.sign(
    { sub: user.id_usuario, email: user.email, perfil: user.perfil },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn },
  );
}

/**
 * Registra um novo cliente e já devolve um token para login automático.
 * O perfil é fixado em "cliente" — contas admin não são criadas por aqui.
 */
export async function register(payload) {
  validateUserPayload(payload);

  const email = payload.email.trim().toLowerCase();

  if (await userRepository.existsByEmail(email)) {
    throw AppError.conflict('E-mail já cadastrado');
  }

  const created = await userRepository.create({
    nome: payload.nome.trim(),
    email,
    senhaHash: await hashPassword(payload.senha),
    perfil: 'cliente',
  });

  // `created` vem das colunas públicas (sem senha); reusa o perfil para o token.
  const token = generateToken({
    id_usuario: created.id_usuario,
    email: created.email,
    perfil: created.perfil,
  });

  return { user: toUserDTO(created), token };
}

/**
 * Autentica por e-mail e senha. Mensagens de erro são genéricas de
 * propósito, para não revelar se o e-mail existe.
 */
export async function login({ email, senha }) {
  if (!email || !senha) {
    throw AppError.badRequest('E-mail e senha são obrigatórios');
  }

  const user = await userRepository.findByEmailWithPassword(email.trim().toLowerCase());

  if (!user || !(await comparePassword(senha, user.senha))) {
    throw AppError.unauthorized('Credenciais inválidas');
  }

  return { user: toUserDTO(user), token: generateToken(user) };
}

/**
 * Gera um link de redefinição e o envia por e-mail (ou loga, em dev).
 * Responde sempre de forma genérica para não revelar se o e-mail existe.
 * Em desenvolvimento devolve a URL para facilitar o teste.
 */
export async function requestPasswordReset(email) {
  if (!email || typeof email !== 'string') {
    throw AppError.badRequest('Informe um e-mail válido');
  }

  const user = await userRepository.findByEmailWithPassword(email.trim().toLowerCase());

  // E-mail inexistente: não revela nada, apenas não envia.
  if (!user) {
    return { devResetUrl: undefined };
  }

  const token = jwt.sign({ sub: user.id_usuario, type: RESET_TOKEN_TYPE }, resetTokenSecret(user.senha), {
    expiresIn: '1h',
  });

  const resetUrl = `${env.lojaUrl}/redefinir-senha?token=${token}`;
  const { resetUrl: devResetUrl } = await sendPasswordResetEmail({
    to: user.email,
    nome: user.nome,
    resetUrl,
  });

  return { devResetUrl: isProduction ? undefined : devResetUrl };
}

/**
 * Valida o token de redefinição e troca a senha.
 */
export async function resetPassword({ token, novaSenha }) {
  if (!token || typeof token !== 'string') {
    throw AppError.badRequest('Token ausente');
  }

  if (!novaSenha || novaSenha.length < 6) {
    throw AppError.badRequest('A nova senha deve ter pelo menos 6 caracteres');
  }

  // Decodifica sem verificar só para descobrir de qual usuário é o token.
  const decoded = jwt.decode(token);
  const user = decoded?.sub ? await userRepository.findByIdWithPassword(decoded.sub) : null;

  if (!user) {
    throw AppError.badRequest('Token inválido ou expirado');
  }

  try {
    const payload = jwt.verify(token, resetTokenSecret(user.senha));
    if (payload.type !== RESET_TOKEN_TYPE) {
      throw new Error('tipo inválido');
    }
  } catch {
    throw AppError.badRequest('Token inválido ou expirado');
  }

  await userRepository.updatePassword(user.id_usuario, await hashPassword(novaSenha));
  return { email: user.email };
}
