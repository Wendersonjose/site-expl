import pool from '../../config/database.js';

/**
 * Colunas públicas do usuário. A coluna `senha` é deliberadamente omitida
 * das consultas de leitura para que o hash nunca trafegue sem necessidade.
 */
const PUBLIC_COLUMNS = 'id_usuario, nome, email, perfil, data_criacao';

export async function findAll() {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM usuarios ORDER BY id_usuario DESC`,
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM usuarios WHERE id_usuario = ?`,
    [id],
  );
  return rows[0] ?? null;
}

/**
 * Busca por e-mail incluindo o hash da senha. Usado apenas internamente
 * pelo fluxo de autenticação — não exponha o resultado diretamente.
 */
export async function findByEmailWithPassword(email) {
  const [rows] = await pool.query(
    `SELECT id_usuario, nome, email, senha, perfil, data_criacao
     FROM usuarios WHERE email = ?`,
    [email],
  );
  return rows[0] ?? null;
}

export async function existsByEmail(email) {
  const [rows] = await pool.query('SELECT 1 FROM usuarios WHERE email = ? LIMIT 1', [email]);
  return rows.length > 0;
}

export async function create(user) {
  const [result] = await pool.query(
    `INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)`,
    [user.nome, user.email, user.senhaHash, user.perfil],
  );
  return findById(result.insertId);
}

export async function update(id, user) {
  await pool.query(
    `UPDATE usuarios SET nome = ?, email = ?, perfil = ? WHERE id_usuario = ?`,
    [user.nome, user.email, user.perfil, id],
  );
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
  return result.affectedRows > 0;
}
