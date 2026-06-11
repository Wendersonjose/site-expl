import bcrypt from 'bcrypt';
import pool from '../../config/database.js';

const USER_COLUMNS = `
  id,
  nome,
  email,
  perfil,
  created_at,
  updated_at
`;

export async function findAll(filters = {}) {
  const values = [];
  const conditions = [];

  if (filters.search) {
    values.push(`%${filters.search}%`, `%${filters.search}%`);
    conditions.push('(nome LIKE ? OR email LIKE ?)');
  }

  if (filters.perfil) {
    values.push(filters.perfil);
    conditions.push('perfil = ?');
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `
      SELECT ${USER_COLUMNS}
      FROM users
      ${where}
      ORDER BY created_at DESC
    `,
    values,
  );

  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `
      SELECT ${USER_COLUMNS}
      FROM users
      WHERE id = ?
    `,
    [id],
  );

  return rows[0];
}

export async function findByEmail(email, { includePassword = false } = {}) {
  const columns = includePassword ? `${USER_COLUMNS}, senha` : USER_COLUMNS;

  const [rows] = await pool.query(
    `
      SELECT ${columns}
      FROM users
      WHERE email = ?
    `,
    [email.trim().toLowerCase()],
  );

  return rows[0];
}

export async function create(user) {
  const passwordHash = await bcrypt.hash(user.senha, 10);

  const [result] = await pool.query(
    `
      INSERT INTO users (nome, email, senha, perfil)
      VALUES (?, ?, ?, ?)
    `,
    [user.nome, user.email, passwordHash, user.perfil],
  );

  return findById(result.insertId);
}

export async function update(id, user) {
  await pool.query(
    `
      UPDATE users
      SET
        nome = ?,
        email = ?,
        perfil = ?,
        updated_at = NOW()
      WHERE id = ?
    `,
    [user.nome, user.email, user.perfil, id],
  );

  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query(
    `
      DELETE FROM users
      WHERE id = ?
    `,
    [id],
  );

  return result.affectedRows > 0 ? { id } : undefined;
}
