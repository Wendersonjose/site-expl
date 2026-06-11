/**
 * Helpers para padronizar o corpo das respostas da API.
 * Toda resposta de sucesso segue o formato { success: true, data }.
 */
export function ok(res, data, { statusCode = 200, message } = {}) {
  const body = { success: true };

  if (message) {
    body.message = message;
  }

  body.data = data;
  return res.status(statusCode).json(body);
}

export function created(res, data, message) {
  return ok(res, data, { statusCode: 201, message });
}

export function noContent(res) {
  return res.status(204).send();
}
