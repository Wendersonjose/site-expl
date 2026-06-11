import pool from '../../config/database.js';
import { AppError } from '../../shared/AppError.js';

/**
 * Acesso à tabela `produtos` (MySQL), com a categoria (JOIN) e a imagem
 * principal (subconsulta) já resolvidas para o DTO. As imagens completas
 * ficam na tabela `imagens_produto` e são carregadas sob demanda em
 * findById.
 */
const PRODUCT_SELECT = `
  SELECT
    p.id_produto,
    p.id_categoria,
    p.nome,
    p.descricao,
    p.preco_venda,
    p.estoque_atual,
    p.custo_unitario,
    p.ativo,
    c.nome_categoria,
    (
      SELECT ip.url
      FROM imagens_produto ip
      WHERE ip.id_produto = p.id_produto
      ORDER BY ip.principal DESC, ip.id_imagem ASC
      LIMIT 1
    ) AS imagem_principal
  FROM produtos p
  JOIN categorias c ON c.id_categoria = p.id_categoria
`;

export async function findAll(filters = {}) {
  const conditions = [];
  const values = [];

  if (filters.search) {
    values.push(`%${filters.search}%`, `%${filters.search}%`);
    conditions.push('(p.nome LIKE ? OR p.descricao LIKE ?)');
  }

  if (filters.categoria) {
    values.push(filters.categoria);
    conditions.push('p.id_categoria = ?');
  }

  if (filters.ativo !== undefined) {
    values.push(filters.ativo ? 1 : 0);
    conditions.push('p.ativo = ?');
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `${PRODUCT_SELECT} ${where} ORDER BY p.id_produto DESC`,
    values,
  );
  return rows;
}

async function findImages(id) {
  const [rows] = await pool.query(
    'SELECT url, principal FROM imagens_produto WHERE id_produto = ? ORDER BY principal DESC, id_imagem ASC',
    [id],
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(`${PRODUCT_SELECT} WHERE p.id_produto = ?`, [id]);
  const product = rows[0];

  if (!product) {
    return null;
  }

  product.imagens = await findImages(id);
  return product;
}

async function replaceImages(conn, idProduto, imagens = []) {
  await conn.query('DELETE FROM imagens_produto WHERE id_produto = ?', [idProduto]);

  for (const imagem of imagens) {
    await conn.query(
      'INSERT INTO imagens_produto (id_produto, url, principal) VALUES (?, ?, ?)',
      [idProduto, imagem.url, imagem.principal ? 1 : 0],
    );
  }
}

export async function create(product) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO produtos
         (id_categoria, nome, descricao, preco_venda, estoque_atual, custo_unitario, ativo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        product.idCategoria,
        product.nome,
        product.descricao,
        product.precoVenda,
        product.estoque,
        product.custoUnitario,
        product.ativo ? 1 : 0,
      ],
    );

    await replaceImages(connection, result.insertId, product.imagens);
    await connection.commit();
    return findById(result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function update(id, product) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE produtos SET
         id_categoria = ?, nome = ?, descricao = ?, preco_venda = ?,
         estoque_atual = ?, custo_unitario = ?, ativo = ?
       WHERE id_produto = ?`,
      [
        product.idCategoria,
        product.nome,
        product.descricao,
        product.precoVenda,
        product.estoque,
        product.custoUnitario,
        product.ativo ? 1 : 0,
        id,
      ],
    );

    if (Array.isArray(product.imagens)) {
      await replaceImages(connection, id, product.imagens);
    }

    await connection.commit();
    return findById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function remove(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM imagens_produto WHERE id_produto = ?', [id]);
    const [result] = await connection.query('DELETE FROM produtos WHERE id_produto = ?', [id]);
    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();

    // Produto referenciado por itens de pedido não pode ser apagado.
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
      throw AppError.conflict('Produto possui pedidos vinculados e não pode ser excluído');
    }

    throw error;
  } finally {
    connection.release();
  }
}
