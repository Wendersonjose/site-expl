import * as orderService from './orders.service.js';
import { ok, created } from '../../shared/httpResponse.js';

export async function createOrder(req, res) {
  const order = await orderService.createOrder(req.user.sub, req.body);
  return created(res, order);
}

export async function listMyOrders(req, res) {
  const orders = await orderService.listOrdersByUser(req.user.sub);
  return ok(res, orders);
}

export async function getOrderById(req, res) {
  const order = await orderService.getOrderById(req.user.sub, req.params.id, {
    isAdmin: req.user.perfil === 'admin',
  });
  return ok(res, order);
}
