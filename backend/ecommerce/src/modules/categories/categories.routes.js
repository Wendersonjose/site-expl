import { Router } from 'express';

import * as categoryController from './categories.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/asyncHandler.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Categorias
 *     description: Categorias de produtos (MySQL)
 */

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Lista categorias
 *     tags: [Categorias]
 *     responses:
 *       200: { description: Categorias listadas com sucesso }
 */
router.get('/', asyncHandler(categoryController.listCategories));

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Cria uma categoria (requer admin)
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nomeCategoria]
 *             properties:
 *               nomeCategoria:
 *                 type: string
 *                 minLength: 2
 *     responses:
 *       201: { description: Categoria criada com sucesso }
 *       400: { description: Nome da categoria inválido }
 *       401: { description: Não autenticado }
 *       403: { description: Sem permissão }
 */
router.post('/', authenticate, authorize('admin'), asyncHandler(categoryController.createCategory));

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Remove uma categoria (requer admin)
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Categoria excluída com sucesso }
 *       401: { description: Não autenticado }
 *       403: { description: Sem permissão }
 *       404: { description: Categoria não encontrada }
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(categoryController.deleteCategory),
);

export default router;
