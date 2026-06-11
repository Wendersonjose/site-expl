// Aplica o schema.sql no banco configurado no .env
// Uso: node database/apply-schema.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

try {
  await connection.query(schema);
  const [tables] = await connection.query('SHOW TABLES');
  console.log('Schema aplicado com sucesso. Tabelas:');
  for (const row of tables) {
    console.log(`- ${Object.values(row)[0]}`);
  }
} finally {
  await connection.end();
}
