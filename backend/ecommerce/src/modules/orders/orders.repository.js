import pool from '../../config/database.js';

/**
 * As funções de escrita recebem a conexão da transação (criada via
 * withTransaction) para que endereço, pedido, itens e baixa de estoque
 * sejam atômicos. As de leitura usam o pool diretamente.
 */

/**
 * Busca os produtos do pedido com lock de linha (FOR UPDATE), impedindo
 * que duas compras simultâneas vendam o mesmo estoque.
 */
export async function findProductsForUpdate(conn, productIds) {
  const [rows] = await conn.query(
    `SELECT id_produto, nome, preco_venda, estoque_atual, ativo
     FROM produtos
     WHERE id_produto IN (?)
     FOR UPDATE`,
    [productIds],
  );
  return rows;
}

export async function insertAddress(conn, userId, endereco) {
  const [result] = await conn.query(
    `INSERT INTO enderecos (id_usuario, cep, rua, numero, cidade, complemento, estado, principal)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      userId,
      endereco.cep,
      endereco.rua,
      endereco.numero,
      endereco.cidade,
      endereco.complemento ?? null,
      endereco.estado,
    ],
  );
  return result.insertId;
}

export async function insertOrder(conn, order) {
  const [result] = await conn.query(
    `INSERT INTO pedidos
       (id_usuario, data_pedido, status, valor_total, id_endereco, id_cupom, subtotal, desconto, frete)
     VALUES (?, NOW(), 'pendente', ?, ?, NULL, ?, ?, ?)`,
    [order.idUsuario, order.valorTotal, order.idEndereco, order.subtotal, order.desconto, order.frete],
  );
  return result.insertId;
}

export async function insertOrderItem(conn, idPedido, item) {
  await conn.query(
    `INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco_unitario, desconto_aplicado)
     VALUES (?, ?, ?, ?, ?)`,
    [idPedido, item.idProduto, item.quantidade, item.precoUnitario, item.descontoAplicado],
  );
}

export async function decrementStock(conn, idProduto, quantidade) {
  await conn.query(
    `UPDATE produtos SET estoque_atual = estoque_atual - ? WHERE id_produto = ?`,
    [quantidade, idProduto],
  );
}

const ORDER_SELECT = `
  SELECT
    p.id_pedido, p.id_usuario, p.data_pedido, p.status,
    p.subtotal, p.desconto, p.frete, p.valor_total,
    e.id_endereco, e.cep, e.rua, e.numero, e.cidade, e.estado, e.complemento
  FROM pedidos p
  JOIN enderecos e ON e.id_endereco = p.id_endereco
`;

export async function findOrdersByUser(userId) {
  const [rows] = await pool.query(
    `${ORDER_SELECT} WHERE p.id_usuario = ? ORDER BY p.id_pedido DESC`,
    [userId],
  );
  return rows;
}

export async function findOrderById(id) {
  const [rows] = await pool.query(`${ORDER_SELECT} WHERE p.id_pedido = ?`, [id]);
  return rows[0] ?? null;
}

export async function findItemsByOrderIds(orderIds) {
  if (orderIds.length === 0) {
    return [];
  }

  const [rows] = await pool.query(
    `SELECT ip.id_pedido, ip.id_produto, pr.nome, ip.quantidade, ip.preco_unitario, ip.desconto_aplicado
     FROM itens_pedido ip
     JOIN produtos pr ON pr.id_produto = ip.id_produto
     WHERE ip.id_pedido IN (?)
     ORDER BY ip.id_item ASC`,
    [orderIds],
  );
  return rows;
}
