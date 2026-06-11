import * as orderService from './orders.service.js';

export async function listOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders(req.user);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.user, req.body);

    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: order,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return next(error);
  }
}
