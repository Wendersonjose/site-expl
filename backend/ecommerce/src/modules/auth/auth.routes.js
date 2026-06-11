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

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Solicita um link de redefinição de senha
 *     tags: [Autenticação]
 *     responses:
 *       200: { description: Resposta genérica (não revela se o e-mail existe) }
 */
router.post('/forgot-password', asyncHandler(authController.forgotPassword));

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Redefine a senha usando o token do link
 *     tags: [Autenticação]
 *     responses:
 *       200: { description: Senha redefinida }
 *       400: { description: Token inválido/expirado ou senha fraca }
 */
router.post('/reset-password', asyncHandler(authController.resetPassword));

export default router;
