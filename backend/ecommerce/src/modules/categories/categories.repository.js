import pool from '../../config/database.js';

/**
 * Acesso à tabela `categorias` (MySQL). Mantém o id numérico como chave,
 * usado como FK por `produtos`.
 */

export async function findAll() {
  const [rows] = await pool.query(
    'SELECT id_categoria, nome_categoria FROM categorias ORDER BY nome_categoria ASC',
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id_categoria, nome_categoria FROM categorias WHERE id_categoria = ?',
    [id],
  );
  return rows[0] ?? null;
}

export async function existsByName(nomeCategoria) {
  const [rows] = await pool.query(
    'SELECT 1 FROM categorias WHERE nome_categoria = ? LIMIT 1',
    [nomeCategoria],
  );
  return rows.length > 0;
}

export async function create(nomeCategoria) {
  const [result] = await pool.query(
    'INSERT INTO categorias (nome_categoria) VALUES (?)',
    [nomeCategoria],
  );
  return { id_categoria: result.insertId, nome_categoria: nomeCategoria };
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
  return result.affectedRows > 0;
}
