import dotenv from 'dotenv';

dotenv.config();

/**
 * Lê uma variável de ambiente obrigatória.
 * Lança erro na inicialização caso ela não exista — falhar cedo evita
 * comportamento imprevisível em produção.
 */
function required(name) {
  const value = process.env[name];

  if (value === undefined || value === '') {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }

  return value;
}

function optional(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: Number(optional('PORT', '3000')),

  database: {
    host: required('DB_HOST'),
    port: Number(required('DB_PORT')),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    name: required('DB_NAME'),
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: optional('JWT_EXPIRES_IN', '7d'),
  },

  // Aceita uma ou mais origens separadas por vírgula (loja + admin em dev).
  frontendUrls: optional('FRONTEND_URL', 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
};

export const isProduction = env.nodeEnv === 'production';
