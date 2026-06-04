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
    values.push(`%${filters.search}%`);
    conditions.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }

  if (filters.category) {
    values.push(filters.category);
    conditions.push(`category = $${values.length}`);
  }

  if (filters.active !== undefined) {
    values.push(filters.active === 'true' || filters.active === true);
    conditions.push(`active = $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query(
    `
      SELECT ${PRODUCT_COLUMNS}
      FROM products
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
      SELECT ${PRODUCT_COLUMNS}
      FROM products
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
}

export async function create(product) {
  const result = await pool.query(
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
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING ${PRODUCT_COLUMNS}
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

  return result.rows[0];
}

export async function update(id, product) {
  const result = await pool.query(
    `
      UPDATE products
      SET
        name = $1,
        description = $2,
        price = $3,
        stock = $4,
        category = $5,
        image_url = $6,
        active = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING ${PRODUCT_COLUMNS}
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

  return result.rows[0];
}

export async function remove(id) {
  const result = await pool.query(
    `
      DELETE FROM products
      WHERE id = $1
      RETURNING id
    `,
    [id],
  );

  return result.rows[0];
}
