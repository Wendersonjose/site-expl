import { Router } from 'express';

import * as orderController from './orders.controller.js';
import { asyncHandler } from '../../shared/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Pedidos
 *     description: Criação e consulta de pedidos do usuário autenticado
 */

// Pedidos sempre pertencem a um usuário autenticado.
router.use(authenticate);

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Cria um pedido com endereço de entrega e itens
 *     tags: [Pedidos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Pedido criado }
 *       400: { description: Estoque insuficiente ou dados inválidos }
 */
router.post('/', asyncHandler(orderController.createOrder));

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Lista os pedidos do usuário autenticado
 *     tags: [Pedidos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de pedidos }
 */
router.get('/', asyncHandler(orderController.listMyOrders));

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido do usuário (admin enxerga qualquer pedido)
 *     tags: [Pedidos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Pedido encontrado }
 *       403: { description: Pedido de outro usuário }
 *       404: { description: Pedido não encontrado }
 */
router.get('/:id', asyncHandler(orderController.getOrderById));

export default router;
