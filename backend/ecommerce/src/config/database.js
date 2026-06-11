import mysql from 'mysql2/promise';

import { env } from './env.js';

/**
 * Pool de conexões MySQL compartilhado pela aplicação.
 *
 * Usar um pool (em vez de abrir/fechar conexões a cada query) reaproveita
 * conexões TCP, evita o custo de handshake repetido e protege o banco
 * limitando o número máximo de conexões simultâneas.
 */
const pool = mysql.createPool({
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  dateStrings: true,
});

/**
 * Verifica se o banco está acessível. Chamado na subida do servidor
 * para falhar cedo caso as credenciais ou a rede estejam incorretas.
 */
export async function assertDatabaseConnection() {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
}

export default pool;
