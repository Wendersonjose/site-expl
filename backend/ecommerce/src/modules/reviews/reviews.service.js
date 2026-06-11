import { AppError } from '../../shared/AppError.js';
import * as orderRepository from '../orders/orders.repository.js';
import * as reviewRepository from './reviews.repository.js';
import { toReviewDTO } from './reviews.mapper.js';
import { parseId, validateReviewPayload } from './reviews.validation.js';

/**
 * Lista as avaliações de um produto junto com a média e o total.
 */
export async function listByProduct(idProduto) {
  const productId = parseId(idProduto, 'idProduto');

  const [rows, resumo] = await Promise.all([
    reviewRepository.findByProduct(productId),
    reviewRepository.averageByProduct(productId),
  ]);

  return {
    media: Number(resumo.media),
    total: Number(resumo.total),
    avaliacoes: rows.map(toReviewDTO),
  };
}

/**
 * Cria uma avaliação. Só o dono do pedido pode avaliar, o pedido precisa
 * conter o produto e não pode haver avaliação duplicada (mesmo
 * usuário/produto/pedido).
 */
export async function createReview(payload, userId) {
  const { idProduto, idPedido, nota, comentario } = validateReviewPayload(payload);

  const order = await orderRepository.findOrderById(idPedido);

  if (!order) {
    throw AppError.notFound('Pedido não encontrado');
  }

  if (order.id_usuario !== userId) {
    throw AppError.forbidden('Você só pode avaliar produtos dos seus próprios pedidos');
  }

  if (!(await reviewRepository.orderContainsProduct(idPedido, idProduto))) {
    throw AppError.badRequest('Este produto não faz parte do pedido informado');
  }

  if (await reviewRepository.exists(userId, idProduto, idPedido)) {
    throw AppError.conflict('Você já avaliou este produto neste pedido');
  }

  const id = await reviewRepository.create({
    idProduto,
    idUsuario: userId,
    idPedido,
    nota,
    comentario,
  });

  return toReviewDTO(await reviewRepository.findById(id));
}
