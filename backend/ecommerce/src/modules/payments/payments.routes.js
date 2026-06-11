import { Router } from 'express';

import * as paymentController from './payments.controller.js';
import { asyncHandler } from '../../shared/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Pagamentos
 *     description: Formas de pagamento e registro de pagamento de pedidos
 */

/**
 * @openapi
 * /payments/methods:
 *   get:
 *     summary: Lista as formas de pagamento ativas
 *     tags: [Pagamentos]
 *     responses:
 *       200: { description: Formas de pagamento }
 */
router.get('/methods', asyncHandler(paymentController.listMethods));

// As demais rotas exigem usuário autenticado.
router.use(authenticate);

/**
 * @openapi
 * /payments:
 *   post:
 *     summary: Paga um pedido (cria transação confirmada e marca o pedido como pago)
 *     tags: [Pagamentos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Pagamento confirmado }
 *       404: { description: Pedido ou forma de pagamento não encontrados }
 *       409: { description: Pedido já pago ou em status incompatível }
 */
router.post('/', asyncHandler(paymentController.payOrder));

/**
 * @openapi
 * /payments/order/{idPedido}:
 *   get:
 *     summary: Lista os pagamentos de um pedido
 *     tags: [Pagamentos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Pagamentos do pedido }
 *       403: { description: Pedido de outro usuário }
 *       404: { description: Pedido não encontrado }
 */
router.get('/order/:idPedido', asyncHandler(paymentController.listOrderPayments));

export default router;
