import { Router } from 'express';

import * as productController from './products.controller.js';
import { asyncHandler } from '../../shared/asyncHandler.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Produtos
 *     description: Catálogo de produtos
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Lista produtos
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoria
 *         schema: { type: string }
 *       - in: query
 *         name: ativo
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: Lista de produtos }
 */
router.get('/', asyncHandler(productController.listProducts));

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Busca um produto por id
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Produto encontrado }
 *       404: { description: Produto não encontrado }
 */
router.get('/:id', asyncHandler(productController.getProductById));

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Cria um produto (requer admin)
 *     tags: [Produtos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Produto criado }
 *       401: { description: Não autenticado }
 *       403: { description: Sem permissão }
 */
router.post('/', authenticate, authorize('admin'), asyncHandler(productController.createProduct));

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto (requer admin)
 *     tags: [Produtos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Produto atualizado }
 */
router.put('/:id', authenticate, authorize('admin'), asyncHandler(productController.updateProduct));

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto (requer admin)
 *     tags: [Produtos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Produto removido }
 */
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(productController.deleteProduct));

export default router;
