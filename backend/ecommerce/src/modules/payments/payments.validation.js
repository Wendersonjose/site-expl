import { AppError } from '../../shared/AppError.js';

export function parseId(id, label = 'ID') {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw AppError.badRequest(`${label} inválido`);
  }

  return numericId;
}

/**
 * Valida o payload de pagamento de um pedido.
 */
export function validatePaymentPayload(payload) {
  const errors = [];

  const idPedido = Number(payload?.idPedido);
  if (!Number.isInteger(idPedido) || idPedido <= 0) {
    errors.push('idPedido é obrigatório e deve ser um id válido');
  }

  const idForma = Number(payload?.idForma);
  if (!Number.isInteger(idForma) || idForma <= 0) {
    errors.push('idForma é obrigatório e deve ser um id válido');
  }

  if (payload?.codigoExterno !== undefined && typeof payload.codigoExterno !== 'string') {
    errors.push('codigoExterno deve ser texto');
  }

  if (errors.length > 0) {
    throw AppError.badRequest('Dados de pagamento inválidos', errors);
  }

  return {
    idPedido,
    idForma,
    codigoExterno: payload.codigoExterno?.trim() || null,
  };
}
