import { AppError } from '../../shared/AppError.js';
import { hashPassword } from '../../shared/password.js';
import * as userRepository from './users.repository.js';
import { toUserDTO } from './users.mapper.js';
import { parseId, validateUserPayload } from './users.validation.js';

export async function listUsers() {
  const rows = await userRepository.findAll();
  return rows.map(toUserDTO);
}

export async function getUserById(id) {
  const userId = parseId(id);
  const row = await userRepository.findById(userId);

  if (!row) {
    throw AppError.notFound('Usuário não encontrado');
  }

  return toUserDTO(row);
}

export async function createUser(payload) {
  validateUserPayload(payload);

  const email = payload.email.trim().toLowerCase();

  if (await userRepository.existsByEmail(email)) {
    throw AppError.conflict('E-mail já cadastrado');
  }

  const row = await userRepository.create({
    nome: payload.nome.trim(),
    email,
    senhaHash: await hashPassword(payload.senha),
    perfil: payload.perfil ?? 'cliente',
  });

  return toUserDTO(row);
}

export async function updateUser(id, payload) {
  const userId = parseId(id);
  validateUserPayload(payload, { partial: true });

  const current = await userRepository.findById(userId);

  if (!current) {
    throw AppError.notFound('Usuário não encontrado');
  }

  const email = payload.email ? payload.email.trim().toLowerCase() : current.email;

  // Garante que o novo e-mail não pertence a outro usuário.
  if (email !== current.email && (await userRepository.existsByEmail(email))) {
    throw AppError.conflict('E-mail já cadastrado');
  }

  const row = await userRepository.update(userId, {
    nome: payload.nome?.trim() ?? current.nome,
    email,
    perfil: payload.perfil ?? current.perfil,
  });

  return toUserDTO(row);
}

export async function deleteUser(id) {
  const userId = parseId(id);
  const deleted = await userRepository.remove(userId);

  if (!deleted) {
    throw AppError.notFound('Usuário não encontrado');
  }
}
