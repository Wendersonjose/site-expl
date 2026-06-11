/**
 * Script para criar um usuário admin no banco de dados.
 * 
 * USO:
 *   node scripts/create-admin.js
 * 
 * Você será solicitado a informar nome, email e senha.
 * A senha será hasheada antes de ser inserida no banco.
 */

import readline from 'readline';
import bcrypt from 'bcrypt';
import pool from '../src/config/database.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('🔐 CRIAR USUÁRIO ADMINISTRADOR\n');

    const nome = await question('Nome completo: ');
    const email = await question('E-mail: ');
    const senha = await question('Senha: ');

    if (!nome || !email || !senha) {
      console.error('❌ Todos os campos são obrigatórios!');
      process.exit(1);
    }

    // Gera o hash da senha
    console.log('\n⏳ Gerando hash da senha...');
    const senhaHash = await bcrypt.hash(senha, 10);

    // Verifica se o e-mail já existe
    const [existing] = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE email = ?',
      [email.trim().toLowerCase()],
    );

    if (existing.length > 0) {
      console.error(`❌ Já existe um usuário com o e-mail ${email}`);
      process.exit(1);
    }

    // Insere o admin no banco
    console.log('⏳ Criando usuário admin...');
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome.trim(), email.trim().toLowerCase(), senhaHash, 'admin'],
    );

    console.log('\n✅ Usuário admin criado com sucesso!');
    console.log(`   ID: ${result.insertId}`);
    console.log(`   Nome: ${nome}`);
    console.log(`   E-mail: ${email}`);
    console.log(`   Perfil: admin`);
    console.log('\n🔑 Use essas credenciais para fazer login.');

  } catch (error) {
    console.error('\n❌ Erro ao criar admin:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    rl.close();
  }
}

createAdmin();
