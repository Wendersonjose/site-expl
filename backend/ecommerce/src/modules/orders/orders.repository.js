import pool from '../../config/database.js';

export async function findAll() {
  const result = await pool.query(`
    SELECT
      orders.id,
      orders.status,
      orders.total,
      orders.created_at,
      users.nome AS customer_name,
      users.email AS customer_email,
      COALESCE(SUM(order_items.quantity), 0)::INTEGER AS item_count
    FROM orders
    INNER JOIN users ON users.id = orders.user_id
    LEFT JOIN order_items ON order_items.order_id = orders.id
    GROUP BY orders.id, users.nome, users.email
    ORDER BY orders.created_at DESC
  `);

  return result.rows;
}

export async function findByUserId(userId) {
  const result = await pool.query(
    `
      SELECT id, status, total, created_at, updated_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId],
  );

  return result.rows;
}

export async function create(userId, items) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const productIds = items.map((item) => item.productId);
    const productsResult = await client.query(
      `
        SELECT id, name, price, stock, active
        FROM products
        WHERE id = ANY($1::int[])
        FOR UPDATE
      `,
      [productIds],
    );

    if (productsResult.rows.length !== productIds.length) {
      const error = new Error('Um ou mais produtos nao foram encontrados');
      error.statusCode = 400;
      throw error;
    }

    const productsById = new Map(productsResult.rows.map((product) => [product.id, product]));
    let total = 0;

    for (const item of items) {
      const product = productsById.get(item.productId);

      if (!product.active) {
        const error = new Error(`${product.name} nao esta disponivel`);
        error.statusCode = 400;
        throw error;
      }

      if (product.stock < item.quantity) {
        const error = new Error(`Estoque insuficiente para ${product.name}`);
        error.statusCode = 400;
        throw error;
      }

      total += Number(product.price) * item.quantity;
    }

    const orderResult = await client.query(
      `
        INSERT INTO orders (user_id, total)
        VALUES ($1, $2)
        RETURNING id, user_id, status, total, created_at
      `,
      [userId, total],
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      const product = productsById.get(item.productId);

      await client.query(
        `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES ($1, $2, $3, $4)
        `,
        [order.id, item.productId, item.quantity, product.price],
      );

      await client.query(
        `
          UPDATE products
          SET stock = stock - $1, updated_at = NOW()
          WHERE id = $2
        `,
        [item.quantity, item.productId],
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function updateStatus(id, status) {
  const result = await pool.query(
    `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, user_id, status, total, created_at, updated_at
    `,
    [status, id],
  );

  return result.rows[0];
}
