import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Gera o hash de uma senha em texto puro. O salt é embutido no próprio
 * hash gerado pelo bcrypt.
 */
export function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Compara uma senha em texto puro com um hash armazenado.
 */
export function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
