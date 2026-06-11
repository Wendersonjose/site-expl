import { AppError } from '../../shared/AppError.js';

export function parseId(id, label = 'ID') {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw AppError.badRequest(`${label} inválido`);
  }

  return numericId;
}

/**
 * Valida o payload de avaliação e devolve os valores normalizados.
 */
export function validateReviewPayload(payload) {
  const errors = [];

  const idProduto = Number(payload?.idProduto);
  if (!Number.isInteger(idProduto) || idProduto <= 0) {
    errors.push('idProduto é obrigatório e deve ser um id válido');
  }

  const idPedido = Number(payload?.idPedido);
  if (!Number.isInteger(idPedido) || idPedido <= 0) {
    errors.push('idPedido é obrigatório e deve ser um id válido');
  }

  const nota = Number(payload?.nota);
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    errors.push('A nota deve ser um inteiro de 1 a 5');
  }

  if (payload?.comentario !== undefined && typeof payload.comentario !== 'string') {
    errors.push('O comentário deve ser texto');
  }

  if (errors.length > 0) {
    throw AppError.badRequest('Dados de avaliação inválidos', errors);
  }

  return {
    idProduto,
    idPedido,
    nota,
    comentario: payload.comentario?.trim() || null,
  };
}
