/**
 * Converte linhas das tabelas de pagamento nos DTOs públicos.
 */
export function toMethodDTO(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id_forma,
    nome: row.nome_forma,
    ativo: Boolean(row.status),
  };
}

export function toTransactionDTO(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id_transacao,
    idPedido: row.id_pedido,
    forma: row.id_forma ? { id: row.id_forma, nome: row.nome_forma ?? null } : null,
    valorRecebido: Number(row.valor_recebido),
    dataPagamento: row.data_pagamento,
    status: row.status_pagamento,
    codigoExterno: row.codigo_externo,
  };
}
