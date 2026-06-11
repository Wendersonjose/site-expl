import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { AppError } from '../../shared/AppError.js';
import { comparePassword, hashPassword } from '../../shared/password.js';
import * as userRepository from '../users/users.repository.js';
import { toUserDTO } from '../users/users.mapper.js';
import { validateUserPayload } from '../users/users.validation.js';

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
