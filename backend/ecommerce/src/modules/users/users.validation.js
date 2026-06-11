import { AppError } from '../../shared/AppError.js';

const PERFIS_VALIDOS = ['cliente', 'admin'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseId(id) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw AppError.badRequest('ID de usuário inválido');
  }

  return numericId;
}

export function validateUserPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.nome !== undefined) {
    if (!payload.nome || payload.nome.trim().length < 3) {
      errors.push('O nome deve ter pelo menos 3 caracteres');
    }
  }

  if (!partial || payload.email !== undefined) {
    if (!payload.email || !EMAIL_REGEX.test(payload.email)) {
      errors.push('E-mail inválido');
    }
  }

  // Senha só é exigida na criação (no update não alteramos senha por aqui).
  if (!partial) {
    if (!payload.senha || payload.senha.length < 6) {
      errors.push('A senha deve ter pelo menos 6 caracteres');
    }
  }

  if (payload.perfil !== undefined && !PERFIS_VALIDOS.includes(payload.perfil)) {
    errors.push(`O perfil deve ser um de: ${PERFIS_VALIDOS.join(', ')}`);
  }

  if (errors.length > 0) {
    throw AppError.badRequest('Dados de usuário inválidos', errors);
  }
}
