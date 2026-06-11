import pool from '../../config/database.js';

/**
 * Acesso à tabela `avaliacoes`.
 */

const REVIEW_SELECT = `
  SELECT
    a.id_avaliacao, a.id_produto, a.id_usuario, a.id_pedido,
    a.nota, a.comentario, a.data_avaliacao,
    u.nome
  FROM avaliacoes a
  JOIN usuarios u ON u.id_usuario = a.id_usuario
`;

export async function findByProduct(idProduto) {
  const [rows] = await pool.query(
    `${REVIEW_SELECT} WHERE a.id_produto = ? ORDER BY a.data_avaliacao DESC`,
    [idProduto],
  );
  return rows;
}

export async function averageByProduct(idProduto) {
  const [rows] = await pool.query(
    `SELECT
       CAST(COALESCE(AVG(nota), 0) AS DECIMAL(3,2)) AS media,
       COUNT(*) AS total
     FROM avaliacoes WHERE id_produto = ?`,
    [idProduto],
  );
  return rows[0];
}

/**
 * Já existe avaliação deste usuário para este produto neste pedido?
 */
export async function exists(idUsuario, idProduto, idPedido) {
  const [rows] = await pool.query(
    `SELECT 1 FROM avaliacoes
     WHERE id_usuario = ? AND id_produto = ? AND id_pedido = ? LIMIT 1`,
    [idUsuario, idProduto, idPedido],
  );
  return rows.length > 0;
}

/**
 * Confirma que o pedido contém o produto (só quem comprou pode avaliar).
 */
export async function orderContainsProduct(idPedido, idProduto) {
  const [rows] = await pool.query(
    `SELECT 1 FROM itens_pedido WHERE id_pedido = ? AND id_produto = ? LIMIT 1`,
    [idPedido, idProduto],
  );
  return rows.length > 0;
}

export async function create(review) {
  const [result] = await pool.query(
    `INSERT INTO avaliacoes (id_produto, id_usuario, id_pedido, nota, comentario)
     VALUES (?, ?, ?, ?, ?)`,
    [review.idProduto, review.idUsuario, review.idPedido, review.nota, review.comentario],
  );
  return result.insertId;
}

export async function findById(idAvaliacao) {
  const [rows] = await pool.query(`${REVIEW_SELECT} WHERE a.id_avaliacao = ?`, [idAvaliacao]);
  return rows[0] ?? null;
}
