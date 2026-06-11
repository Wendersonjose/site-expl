import { AppError } from '../../shared/AppError.js';
import { withTransaction } from '../../shared/withTransaction.js';
import * as orderRepository from '../orders/orders.repository.js';
import * as paymentRepository from './payments.repository.js';
import { toMethodDTO, toTransactionDTO } from './payments.mapper.js';
import { parseId, validatePaymentPayload } from './payments.validation.js';

export async function listMethods() {
  const rows = await paymentRepository.findActiveMethods();
  return rows.map(toMethodDTO);
}

/**
 * Garante que o pedido existe e pertence ao usuário (admin enxerga tudo).
 */
async function loadOwnedOrder(idPedido, userId, isAdmin) {
  const order = await orderRepository.findOrderById(idPedido);

  if (!order) {
    throw AppError.notFound('Pedido não encontrado');
  }

  if (!isAdmin && order.id_usuario !== userId) {
    throw AppError.forbidden('Este pedido pertence a outro usuário');
  }

  return order;
}

export async function listOrderPayments(idPedido, userId, isAdmin) {
  const orderId = parseId(idPedido, 'idPedido');
  await loadOwnedOrder(orderId, userId, isAdmin);

  const rows = await paymentRepository.findByOrder(orderId);
  return rows.map(toTransactionDTO);
}

/**
 * Registra o pagamento de um pedido: cria a transação financeira como
 * "Confirmado" e marca o pedido como "pago" — tudo em transação.
 */
export async function payOrder(payload, userId, isAdmin) {
  const { idPedido, idForma, codigoExterno } = validatePaymentPayload(payload);

  const order = await loadOwnedOrder(idPedido, userId, isAdmin);

  if (order.status !== 'pendente') {
    throw AppError.conflict(`Pedido não pode ser pago (status atual: ${order.status})`);
  }

  if (await paymentRepository.hasConfirmedPayment(idPedido)) {
    throw AppError.conflict('Este pedido já possui um pagamento confirmado');
  }

  const method = await paymentRepository.findMethodById(idForma);

  if (!method || !method.status) {
    throw AppError.notFound('Forma de pagamento não encontrada ou inativa');
  }

  const transactionId = await withTransaction(async (conn) => {
    const id = await paymentRepository.insertTransaction(conn, {
      idPedido,
      idForma,
      valorRecebido: Number(order.valor_total),
      statusPagamento: 'Confirmado',
      codigoExterno,
    });

    await orderRepository.updateStatus(conn, idPedido, 'pago');
    return id;
  });

  const transaction = await paymentRepository.findById(transactionId);
  return toTransactionDTO(transaction);
}
