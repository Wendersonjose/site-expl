import app from './app.js';
import { env } from './config/env.js';
import { assertDatabaseConnection } from './config/database.js';

/**
 * Ponto de entrada: valida a conexão com o banco antes de aceitar
 * requisições. Se o banco estiver inacessível, encerra o processo.
 */
async function start() {
  try {
    await assertDatabaseConnection();
    console.log('✅ Conexão com o banco de dados estabelecida.');

    app.listen(env.port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${env.port}`);
      console.log(`📚 Documentação em http://localhost:${env.port}/docs`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

start();
