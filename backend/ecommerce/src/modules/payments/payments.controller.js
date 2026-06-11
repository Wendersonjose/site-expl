import * as paymentService from './payments.service.js';
import { ok, created } from '../../shared/httpResponse.js';

export async function listMethods(_req, res) {
  const methods = await paymentService.listMethods();
  return ok(res, methods);
}

export async function payOrder(req, res) {
  const transaction = await paymentService.payOrder(
    req.body,
    req.user.sub,
    req.user.perfil === 'admin',
  );
  return created(res, transaction, 'Pagamento confirmado');
}

export async function listOrderPayments(req, res) {
  const payments = await paymentService.listOrderPayments(
    req.params.idPedido,
    req.user.sub,
    req.user.perfil === 'admin',
  );
  return ok(res, payments);
}
