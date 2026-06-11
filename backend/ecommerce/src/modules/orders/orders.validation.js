import { AppError } from '../../shared/AppError.js';

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
];

export function parseId(id) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw AppError.badRequest('ID de pedido inválido');
  }

  return numericId;
}

/**
 * Valida o payload de criação de pedido: endereço de entrega e lista de
 * itens com produto e quantidade.
 */
export function validateOrderPayload(payload) {
  const errors = [];
  const endereco = payload?.endereco;
  const itens = payload?.itens;

  if (!endereco || typeof endereco !== 'object') {
    errors.push('O endereço de entrega é obrigatório');
  } else {
    for (const campo of ['cep', 'rua', 'numero', 'cidade', 'estado']) {
      if (!endereco[campo] || !String(endereco[campo]).trim()) {
        errors.push(`O campo de endereço "${campo}" é obrigatório`);
      }
    }

    if (endereco.estado && !UFS.includes(String(endereco.estado).trim().toUpperCase())) {
      errors.push('O estado deve ser uma UF válida (ex.: PE, SP)');
    }
  }

  if (!Array.isArray(itens) || itens.length === 0) {
    errors.push('O pedido deve ter pelo menos um item');
  } else {
    itens.forEach((item, index) => {
      const idProduto = Number(item?.idProduto);
      const quantidade = Number(item?.quantidade);

      if (!Number.isInteger(idProduto) || idProduto <= 0) {
        errors.push(`Item ${index + 1}: idProduto inválido`);
      }

      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        errors.push(`Item ${index + 1}: quantidade deve ser um inteiro maior que zero`);
      }
    });
  }

  if (errors.length > 0) {
    throw AppError.badRequest('Dados de pedido inválidos', errors);
  }
}
