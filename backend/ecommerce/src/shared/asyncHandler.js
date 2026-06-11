/**
 * Envolve um controller assíncrono para encaminhar qualquer rejeição ao
 * middleware de erro do Express, eliminando o try/catch repetido em cada
 * handler.
 *
 * Uso: router.get('/', asyncHandler(controller.listar))
 */
export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
