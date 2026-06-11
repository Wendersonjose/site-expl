import * as orderRepository from './orders.repository.js';

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError(400, 'Adicione pelo menos um produto ao carrinho');
  }

  return items.map((item) => {
    const productId = Number(item.productId ?? item.id);
    const quantity = Number(item.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw createHttpError(400, 'Produto invalido no carrinho');
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw createHttpError(400, 'Quantidade invalida no carrinho');
    }

    return { productId, quantity };
  });
}

export async function listOrders(user) {
  if (user.perfil === 'admin') {
    return orderRepository.findAll();
  }

  return orderRepository.findByUserId(user.id);
}

export async function createOrder(user, payload) {
  const items = normalizeItems(payload.items);
  return orderRepository.create(user.id, items);
}

export async function updateOrderStatus(id, status) {
  const orderId = Number(id);
  const allowedStatuses = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'];

  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw createHttpError(400, 'ID do pedido invalido');
  }

  if (!allowedStatuses.includes(status)) {
    throw createHttpError(400, 'Status do pedido invalido');
  }

  const order = await orderRepository.updateStatus(orderId, status);

  if (!order) {
    throw createHttpError(404, 'Pedido nao encontrado');
  }

  return order;
}
