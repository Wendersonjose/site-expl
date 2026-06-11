import pool from '../../config/database.js';

const PRODUCT_COLUMNS = `
  id,
  name,
  description,
  price,
  stock,
  category,
  image_url,
  active,
  created_at,
  updated_at
`;

export async function findAll(filters = {}) {
  const values = [];
  const conditions = [];

  if (filters.search) {
    values.push(`%${filters.search}%`, `%${filters.search}%`);
    conditions.push('(name LIKE ? OR description LIKE ?)');
  }

  if (filters.category) {
    values.push(filters.category);
    conditions.push('category = ?');
  }

  if (filters.active !== undefined) {
    values.push(filters.active === 'true' || filters.active === true);
    conditions.push('active = ?');
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `
      SELECT ${PRODUCT_COLUMNS}
      FROM products
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
      SELECT ${PRODUCT_COLUMNS}
      FROM products
      WHERE id = ?
    `,
    [id],
  );

  return rows[0];
}

export async function create(product) {
  const [result] = await pool.query(
    `
      INSERT INTO products (
        name,
        description,
        price,
        stock,
        category,
        image_url,
        active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      product.name,
      product.description,
      product.price,
      product.stock,
      product.category,
      product.imageUrl,
      product.active,
    ],
  );

  return findById(result.insertId);
}

export async function update(id, product) {
  await pool.query(
    `
      UPDATE products
      SET
        name = ?,
        description = ?,
        price = ?,
        stock = ?,
        category = ?,
        image_url = ?,
        active = ?,
        updated_at = NOW()
      WHERE id = ?
    `,
    [
      product.name,
      product.description,
      product.price,
      product.stock,
      product.category,
      product.imageUrl,
      product.active,
      id,
    ],
  );

  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query(
    `
      DELETE FROM products
      WHERE id = ?
    `,
    [id],
  );

  return result.affectedRows > 0 ? { id } : undefined;
}
