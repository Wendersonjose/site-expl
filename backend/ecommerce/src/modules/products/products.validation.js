import { AppError } from '../../shared/AppError.js';

/**
 * Valida e normaliza o id numérico recebido na rota.
 */
export function parseId(id) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw AppError.badRequest('ID de produto inválido');
  }

  return numericId;
}

function isPositiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
}

/**
 * Valida o payload de produto. Em modo `partial` (PUT/PATCH) apenas os
 * campos presentes são exigidos.
 */
export function validateProductPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.nome !== undefined) {
    if (!payload.nome || payload.nome.trim().length < 3) {
      errors.push('O nome deve ter pelo menos 3 caracteres');
    }
  }

  if (!partial || payload.precoVenda !== undefined) {
    if (!isPositiveNumber(payload.precoVenda)) {
      errors.push('O preço de venda deve ser um número maior ou igual a zero');
    }
  }

  if (!partial || payload.custoUnitario !== undefined) {
    if (!isPositiveNumber(payload.custoUnitario)) {
      errors.push('O custo unitário deve ser um número maior ou igual a zero');
    }
  }

  if (!partial || payload.estoque !== undefined) {
    const estoque = Number(payload.estoque);
    if (!Number.isInteger(estoque) || estoque < 0) {
      errors.push('O estoque deve ser um número inteiro maior ou igual a zero');
    }
  }

  if (!partial || payload.idCategoria !== undefined) {
    const categoria = Number(payload.idCategoria);
    if (!Number.isInteger(categoria) || categoria <= 0) {
      errors.push('A categoria é obrigatória e deve ser um id válido');
    }
  }

  if (errors.length > 0) {
    throw AppError.badRequest('Dados de produto inválidos', errors);
  }
}
