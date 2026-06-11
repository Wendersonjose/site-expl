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
    values.push(`%${filters.search}%`);
    conditions.push(`(nome ILIKE $${values.length} OR email ILIKE $${values.length})`);
  }

  if (filters.perfil) {
    values.push(filters.perfil);
    conditions.push(`perfil = $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query(
    `
      SELECT ${USER_COLUMNS}
      FROM users
      ${where}
      ORDER BY created_at DESC
    `,
    values,
  );

  return result.rows;
}

export async function findById(id) {
  const result = await pool.query(
    `
      SELECT ${USER_COLUMNS}
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
}

export async function findByEmail(email, { includePassword = false } = {}) {
  const columns = includePassword ? `${USER_COLUMNS}, senha` : USER_COLUMNS;

  const result = await pool.query(
    `
      SELECT ${columns}
      FROM users
      WHERE email = $1
    `,
    [email.trim().toLowerCase()],
  );

  return result.rows[0];
}

export async function create(user) {
  const passwordHash = await bcrypt.hash(user.senha, 10);

  const result = await pool.query(
    `
      INSERT INTO users (nome, email, senha, perfil)
      VALUES ($1, $2, $3, $4)
      RETURNING ${USER_COLUMNS}
    `,
    [user.nome, user.email, passwordHash, user.perfil],
  );

  return result.rows[0];
}

export async function update(id, user) {
  const result = await pool.query(
    `
      UPDATE users
      SET
        nome = $1,
        email = $2,
        perfil = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING ${USER_COLUMNS}
    `,
    [user.nome, user.email, user.perfil, id],
  );

  return result.rows[0];
}

export async function remove(id) {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `,
    [id],
  );

  return result.rows[0];
}
