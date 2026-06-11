import { Router } from 'express';

import * as reviewController from './reviews.controller.js';
import { asyncHandler } from '../../shared/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Avaliações
 *     description: Avaliações de produtos pelos clientes
 */

/**
 * @openapi
 * /reviews/product/{idProduto}:
 *   get:
 *     summary: Lista avaliações de um produto (média + total + comentários)
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: idProduto
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Avaliações do produto }
 */
router.get('/product/:idProduto', asyncHandler(reviewController.listByProduct));

/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: Avalia um produto comprado (cliente autenticado)
 *     tags: [Avaliações]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Avaliação registrada }
 *       400: { description: Produto não faz parte do pedido / dados inválidos }
 *       403: { description: Pedido de outro usuário }
 *       409: { description: Produto já avaliado neste pedido }
 */
router.post('/', authenticate, asyncHandler(reviewController.createReview));

export default router;
