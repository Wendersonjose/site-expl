import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../users/users.repository.js';
import * as userService from '../users/users.service.js';

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function createToken(user) {
  const secret = process.env.JWT_SECRET || 'explosion-dev-secret';

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      perfil: user.perfil,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
}

function sanitizeUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    perfil: user.perfil,
  };
}

export async function register(payload) {
  const user = await userService.createUser({
    ...payload,
    perfil: 'cliente',
  });

  return {
    user: sanitizeUser(user),
  };
}

export async function login(payload) {
  const email = payload.email?.trim().toLowerCase();
  const senha = payload.senha;

  if (!email || !senha) {
    throw createHttpError(400, 'Informe email e senha');
  }

  const user = await userRepository.findByEmail(email, { includePassword: true });

  if (!user) {
    throw createHttpError(401, 'Email ou senha invalidos');
  }

  const passwordMatches = await bcrypt.compare(senha, user.senha);

  if (!passwordMatches) {
    throw createHttpError(401, 'Email ou senha invalidos');
  }

  const cleanUser = sanitizeUser(user);

  return {
    user: cleanUser,
    token: createToken(cleanUser),
  };
}
