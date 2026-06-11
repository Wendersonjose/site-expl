import pool from '../../config/database.js';

/**
 * Acesso às tabelas `formas_pagamento` e `transacoes_financeiras`.
 */

export async function findActiveMethods() {
  const [rows] = await pool.query(
    'SELECT id_forma, nome_forma, status FROM formas_pagamento WHERE status = 1 ORDER BY nome_forma ASC',
  );
  return rows;
}

export async function findMethodById(id) {
  const [rows] = await pool.query(
    'SELECT id_forma, nome_forma, status FROM formas_pagamento WHERE id_forma = ?',
    [id],
  );
  return rows[0] ?? null;
}

const TRANSACTION_SELECT = `
  SELECT
    t.id_transacao, t.id_pedido, t.id_forma, t.valor_recebido,
    t.data_pagamento, t.status_pagamento, t.codigo_externo,
    f.nome_forma
  FROM transacoes_financeiras t
  JOIN formas_pagamento f ON f.id_forma = t.id_forma
`;

export async function findByOrder(idPedido) {
  const [rows] = await pool.query(
    `${TRANSACTION_SELECT} WHERE t.id_pedido = ? ORDER BY t.id_transacao DESC`,
    [idPedido],
  );
  return rows;
}

export async function findById(idTransacao) {
  const [rows] = await pool.query(`${TRANSACTION_SELECT} WHERE t.id_transacao = ?`, [idTransacao]);
  return rows[0] ?? null;
}

/**
 * Conta pagamentos já confirmados de um pedido (para impedir pagar 2x).
 */
export async function hasConfirmedPayment(idPedido) {
  const [rows] = await pool.query(
    `SELECT 1 FROM transacoes_financeiras
     WHERE id_pedido = ? AND status_pagamento = 'Confirmado' LIMIT 1`,
    [idPedido],
  );
  return rows.length > 0;
}

export async function insertTransaction(executor, transaction) {
  const [result] = await executor.query(
    `INSERT INTO transacoes_financeiras
       (id_pedido, id_forma, valor_recebido, data_pagamento, status_pagamento, codigo_externo)
     VALUES (?, ?, ?, NOW(), ?, ?)`,
    [
      transaction.idPedido,
      transaction.idForma,
      transaction.valorRecebido,
      transaction.statusPagamento,
      transaction.codigoExterno,
    ],
  );
  return result.insertId;
}
