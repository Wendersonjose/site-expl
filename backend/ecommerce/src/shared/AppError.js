/**
 * Erro de aplicação previsível (regra de negócio / validação).
 *
 * Diferente de um erro inesperado, um AppError carrega o status HTTP
 * apropriado e é considerado "operacional" — algo que sabemos tratar e
 * responder ao cliente sem expor stack trace.
 */
export class AppError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message, details) {
    return new AppError(400, message, details);
  }

  static unauthorized(message = 'Não autenticado') {
    return new AppError(401, message);
  }

  static forbidden(message = 'Acesso negado') {
    return new AppError(403, message);
  }

  static notFound(message = 'Recurso não encontrado') {
    return new AppError(404, message);
  }

  static conflict(message) {
    return new AppError(409, message);
  }
}
