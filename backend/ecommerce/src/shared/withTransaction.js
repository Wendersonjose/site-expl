import pool from '../config/database.js';

/**
 * Executa `fn` dentro de uma transação MySQL. Faz commit se a função
 * resolver e rollback se lançar erro — garantindo tudo-ou-nada para
 * operações que tocam várias tabelas (ex.: criação de pedido).
 *
 * A função recebe a conexão da transação e deve usá-la em todas as
 * queries: withTransaction(async (conn) => { ... })
 */
export async function withTransaction(fn) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await fn(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
