import * as userRepository from './users.repository.js';

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateId(id) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw createHttpError(400, 'ID do usuário inválido');
  }

  return numericId;
}

function validateUserPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.nome !== undefined) {
    if (!payload.nome || payload.nome.trim().length < 3) {
      errors.push('O nome deve ter pelo menos 3 caracteres');
    }
  }

  if (!partial || payload.email !== undefined) {
    if (!payload.email || !payload.email.includes('@')) {
      errors.push('Email inválido');
    }
  }

  if (!partial || payload.senha !== undefined) {
    if (!payload.senha || payload.senha.length < 6) {
      errors.push('A senha deve ter pelo menos 6 caracteres');
    }
  }

  return errors;
}

function throwIfErrors(errors) {
  if (errors.length > 0) {
    throw createHttpError(400, errors.join('. '));
  }
}

export async function listUsers(filters) {
  return userRepository.findAll(filters);
}

export async function getUserById(id) {
  const userId = validateId(id);
  const user = await userRepository.findById(userId);

  if (!user) {
    throw createHttpError(404, 'Usuário não encontrado');
  }

  return user;
}

export async function createUser(payload) {
  const errors = validateUserPayload(payload);
  throwIfErrors(errors);

  const existingUser = await userRepository.findByEmail(payload.email);

  if (existingUser) {
    throw createHttpError(409, 'Email já cadastrado');
  }

  return userRepository.create({
    nome: payload.nome.trim(),
    email: payload.email.trim().toLowerCase(),
    senha: payload.senha,
    perfil: payload.perfil || 'cliente',
  });
}

export async function updateUser(id, payload) {
  const userId = validateId(id);

  const errors = validateUserPayload(payload, { partial: true });
  throwIfErrors(errors);

  const currentUser = await userRepository.findById(userId);

  if (!currentUser) {
    throw createHttpError(404, 'Usuário não encontrado');
  }

  return userRepository.update(userId, {
    nome: payload.nome?.trim() ?? currentUser.nome,
    email: payload.email?.trim().toLowerCase() ?? currentUser.email,
    perfil: payload.perfil ?? currentUser.perfil,
  });
}

export async function deleteUser(id) {
  const userId = validateId(id);

  const deletedUser = await userRepository.remove(userId);

  if (!deletedUser) {
    throw createHttpError(404, 'Usuário não encontrado');
  }
}