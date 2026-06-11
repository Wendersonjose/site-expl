import pool from '../../config/database.js';

export async function findAll() {
  const [rows] = await pool.query(`
    SELECT
      orders.id,
      orders.status,
      orders.total,
      orders.created_at,
      users.nome AS customer_name,
      users.email AS customer_email,
      CAST(COALESCE(SUM(order_items.quantity), 0) AS SIGNED) AS item_count
    FROM orders
    INNER JOIN users ON users.id = orders.user_id
    LEFT JOIN order_items ON order_items.order_id = orders.id
    GROUP BY orders.id, users.nome, users.email
    ORDER BY orders.created_at DESC
  `);

  return rows;
}

export async function findByUserId(userId) {
  const [rows] = await pool.query(
    `
      SELECT id, status, total, created_at, updated_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
    [userId],
  );

  return rows;
}

export async function create(userId, items) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const productIds = items.map((item) => item.productId);
    const [products] = await connection.query(
      `
        SELECT id, name, price, stock, active
        FROM products
        WHERE id IN (?)
        FOR UPDATE
      `,
      [productIds],
    );

    if (products.length !== productIds.length) {
      const error = new Error('Um ou mais produtos nao foram encontrados');
      error.statusCode = 400;
      throw error;
    }

    const productsById = new Map(products.map((product) => [product.id, product]));
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

    const [orderResult] = await connection.query(
      `
        INSERT INTO orders (user_id, total)
        VALUES (?, ?)
      `,
      [userId, total],
    );

    const [orderRows] = await connection.query(
      `
        SELECT id, user_id, status, total, created_at
        FROM orders
        WHERE id = ?
      `,
      [orderResult.insertId],
    );

    const order = orderRows[0];

    for (const item of items) {
      const product = productsById.get(item.productId);

      await connection.query(
        `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES (?, ?, ?, ?)
        `,
        [order.id, item.productId, item.quantity, product.price],
      );

      await connection.query(
        `
          UPDATE products
          SET stock = stock - ?, updated_at = NOW()
          WHERE id = ?
        `,
        [item.quantity, item.productId],
      );
    }

    await connection.commit();
    return order;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateStatus(id, status) {
  await pool.query(
    `
      UPDATE orders
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `,
    [status, id],
  );

  const [rows] = await pool.query(
    `
      SELECT id, user_id, status, total, created_at, updated_at
      FROM orders
      WHERE id = ?
    `,
    [id],
  );

  return rows[0];
}
