import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { AppError } from '../shared/AppError.js';

/**
 * Exige um token JWT válido no header Authorization (Bearer).
 * Em caso de sucesso, popula req.user com o payload do token.
 */
export function authenticate(req, _res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Token de autenticação ausente'));
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    req.user = jwt.verify(token, env.jwt.secret);
    return next();
  } catch {
    return next(AppError.unauthorized('Token inválido ou expirado'));
  }
}

/**
 * Restringe o acesso a determinados perfis de usuário.
 * Deve ser usado após o middleware authenticate.
 *
 * Uso: router.post('/', authenticate, authorize('admin'), controller.criar)
 */
export function authorize(...perfis) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }

    if (perfis.length > 0 && !perfis.includes(req.user.perfil)) {
      return next(AppError.forbidden('Você não tem permissão para esta ação'));
    }

    return next();
  };
}
