import { AppError } from '../../shared/AppError.js';
import { withTransaction } from '../../shared/withTransaction.js';
import * as orderRepository from './orders.repository.js';
import { toOrderDTO } from './orders.mapper.js';
import { parseId, validateOrderPayload } from './orders.validation.js';

// Sem cálculo de frete e cupons por enquanto — campos existem no banco
// e ficam zerados até esses recursos serem implementados.
const FRETE = 0;
const DESCONTO = 0;

/**
 * Consolida itens repetidos do carrinho (mesmo produto em duas linhas
 * vira uma só com a soma das quantidades).
 */
function consolidateItems(itens) {
  const byProduct = new Map();

  for (const item of itens) {
    const idProduto = Number(item.idProduto);
    const quantidade = Number(item.quantidade);
    byProduct.set(idProduto, (byProduct.get(idProduto) ?? 0) + quantidade);
  }

  return [...byProduct.entries()].map(([idProduto, quantidade]) => ({ idProduto, quantidade }));
}

/**
 * Cria um pedido completo em transação: valida estoque com lock de
 * linha, grava endereço, pedido e itens, e dá baixa no estoque.
 */
export async function createOrder(userId, payload) {
  validateOrderPayload(payload);

  const itens = consolidateItems(payload.itens);
  const productIds = itens.map((item) => item.idProduto);

  const orderId = await withTransaction(async (conn) => {
    const products = await orderRepository.findProductsForUpdate(conn, productIds);
    const productsById = new Map(products.map((p) => [p.id_produto, p]));

    const problems = [];

    for (const item of itens) {
      const product = productsById.get(item.idProduto);

      if (!product) {
        problems.push(`Produto ${item.idProduto} não encontrado`);
      } else if (!product.ativo) {
        problems.push(`Produto "${product.nome}" não está disponível`);
      } else if (product.estoque_atual < item.quantidade) {
        problems.push(
          `Estoque insuficiente de "${product.nome}" (disponível: ${product.estoque_atual})`,
        );
      }
    }

    if (problems.length > 0) {
      throw AppError.badRequest('Não foi possível criar o pedido', problems);
    }

    const subtotal = itens.reduce((total, item) => {
      const product = productsById.get(item.idProduto);
      return total + Number(product.preco_venda) * item.quantidade;
    }, 0);

    const idEndereco = await orderRepository.insertAddress(conn, userId, {
      cep: String(payload.endereco.cep).trim(),
      rua: String(payload.endereco.rua).trim(),
      numero: String(payload.endereco.numero).trim(),
      cidade: String(payload.endereco.cidade).trim(),
      estado: String(payload.endereco.estado).trim().toUpperCase(),
      complemento: payload.endereco.complemento?.trim() || null,
    });

    const idPedido = await orderRepository.insertOrder(conn, {
      idUsuario: userId,
      idEndereco,
      subtotal,
      desconto: DESCONTO,
      frete: FRETE,
      valorTotal: subtotal - DESCONTO + FRETE,
    });

    for (const item of itens) {
      const product = productsById.get(item.idProduto);

      await orderRepository.insertOrderItem(conn, idPedido, {
        idProduto: item.idProduto,
        quantidade: item.quantidade,
        precoUnitario: Number(product.preco_venda),
        descontoAplicado: 0,
      });

      await orderRepository.decrementStock(conn, item.idProduto, item.quantidade);
    }

    return idPedido;
  });

  return getOrderById(userId, orderId, { isAdmin: true });
}

export async function listOrdersByUser(userId) {
  const orders = await orderRepository.findOrdersByUser(userId);
  const items = await orderRepository.findItemsByOrderIds(orders.map((o) => o.id_pedido));

  return orders.map((order) =>
    toOrderDTO(order, items.filter((item) => item.id_pedido === order.id_pedido)),
  );
}

export async function getOrderById(userId, id, { isAdmin = false } = {}) {
  const orderId = parseId(id);
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw AppError.notFound('Pedido não encontrado');
  }

  // Cada cliente só enxerga os próprios pedidos.
  if (!isAdmin && order.id_usuario !== userId) {
    throw AppError.forbidden('Este pedido pertence a outro usuário');
  }

  const items = await orderRepository.findItemsByOrderIds([orderId]);
  return toOrderDTO(order, items);
}
