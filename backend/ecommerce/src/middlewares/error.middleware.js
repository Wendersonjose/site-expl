import { AppError } from '../shared/AppError.js';
import { isProduction } from '../config/env.js';

/**
 * Traduz erros conhecidos do MySQL em respostas amigáveis.
 * Retorna um AppError quando o erro é tratável, ou null caso contrário.
 */
function mapDatabaseError(error) {
  switch (error.code) {
    case 'ER_DUP_ENTRY':
      return AppError.conflict('Registro já existe (valor duplicado)');
    case 'ER_NO_REFERENCED_ROW_2':
    case 'ER_ROW_IS_REFERENCED_2':
      return AppError.badRequest('Violação de integridade referencial');
    default:
      return null;
  }
}

/**
 * Middleware central de tratamento de erros.
 * Deve ser o último middleware registrado na aplicação.
 */
// eslint-disable-next-line no-unused-vars -- a assinatura de 4 args é o que sinaliza ao Express que é um error handler
export function errorMiddleware(error, req, res, next) {
  const normalized = error instanceof AppError ? error : mapDatabaseError(error) ?? error;

  const statusCode = normalized.statusCode || 500;

  // Erros inesperados (500) são logados na íntegra para depuração.
  if (statusCode >= 500) {
    console.error(error);
  }

  const body = {
    success: false,
    message: normalized.message || 'Erro interno do servidor',
  };

  if (normalized.details) {
    body.details = normalized.details;
  }

  // Só expõe stack trace fora de produção.
  if (!isProduction && statusCode >= 500) {
    body.stack = error.stack;
  }

  return res.status(statusCode).json(body);
}
