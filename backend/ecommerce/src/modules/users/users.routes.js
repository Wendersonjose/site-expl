import { Router } from 'express';

import * as userController from './users.controller.js';
import { asyncHandler } from '../../shared/asyncHandler.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Usuários
 *     description: Gestão de usuários (acesso restrito a admin)
 */

// Todas as rotas de usuário exigem autenticação de administrador.
router.use(authenticate, authorize('admin'));

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Lista usuários
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de usuários }
 */
router.get('/', asyncHandler(userController.listUsers));

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Busca usuário por id
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuário encontrado }
 *       404: { description: Usuário não encontrado }
 */
router.get('/:id', asyncHandler(userController.getUserById));

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Cria usuário
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Usuário criado }
 */
router.post('/', asyncHandler(userController.createUser));

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Atualiza usuário
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuário atualizado }
 */
router.put('/:id', asyncHandler(userController.updateUser));

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Remove usuário
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Usuário removido }
 */
router.delete('/:id', asyncHandler(userController.deleteUser));

export default router;
