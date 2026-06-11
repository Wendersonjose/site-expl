import { Router } from 'express';

import * as authController from './auth.controller.js';
import { asyncHandler } from '../../shared/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Autenticação
 *     description: Registro e login de usuários
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra um novo cliente
 *     tags: [Autenticação]
 *     responses:
 *       201: { description: Usuário criado e autenticado }
 *       409: { description: E-mail já cadastrado }
 */
router.post('/register', asyncHandler(authController.register));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autentica e retorna um token JWT
 *     tags: [Autenticação]
 *     responses:
 *       200: { description: Autenticado }
 *       401: { description: Credenciais inválidas }
 */
router.post('/login', asyncHandler(authController.login));

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Autenticação]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dados do token }
 *       401: { description: Não autenticado }
 */
router.get('/me', authenticate, asyncHandler(authController.me));

export default router;
