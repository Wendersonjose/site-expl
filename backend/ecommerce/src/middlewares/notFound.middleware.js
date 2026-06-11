import { AppError } from '../shared/AppError.js';

/**
 * Captura requisições para rotas inexistentes e encaminha um 404
 * padronizado ao middleware de erro.
 */
export function notFoundMiddleware(req, _res, next) {
  next(AppError.notFound(`Rota não encontrada: ${req.method} ${req.originalUrl}`));
}
