import { Router } from 'express';

import {
  REPORT_KEYS,
  createDownloadHandler,
  createReportHandler,
  listReports,
  reportsDashboard,
  reportsStatus,
} from './reports.controller.js';
import { asyncHandler } from '../../shared/asyncHandler.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Relatórios
 *     description: Relatórios gerenciais com exportação CSV/PDF (somente admin)
 */

// Relatórios expõem dados financeiros — acesso restrito a administradores.
router.use(authenticate, authorize('admin'));

/**
 * @openapi
 * /reports:
 *   get:
 *     summary: Lista os relatórios disponíveis e seus filtros
 *     tags: [Relatórios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Catálogo de relatórios }
 */
router.get('/', asyncHandler(listReports));

/**
 * @openapi
 * /reports/status:
 *   get:
 *     summary: Verifica se a API de relatórios e o banco estão funcionando
 *     tags: [Relatórios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Status da API e do banco }
 */
router.get('/status', asyncHandler(reportsStatus));

/**
 * @openapi
 * /reports/dashboard:
 *   get:
 *     summary: Resumo consolidado de todos os relatórios
 *     tags: [Relatórios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard com todos os relatórios }
 */
router.get('/dashboard', asyncHandler(reportsDashboard));

/**
 * @openapi
 * /reports/{relatorio}:
 *   get:
 *     summary: "Relatórios disponíveis: faturamento-total, ticket-medio, produtos-mais-vendidos, clientes-com-mais-compras, estoque-baixo (cada um aceita /export/csv e /export/pdf)"
 *     tags: [Relatórios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: relatorio
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Dados do relatório }
 */
for (const key of REPORT_KEYS) {
  router.get(`/${key}`, asyncHandler(createReportHandler(key)));
  router.get(`/${key}/export/csv`, asyncHandler(createDownloadHandler(key, 'csv')));
  router.get(`/${key}/export/pdf`, asyncHandler(createDownloadHandler(key, 'pdf')));
}

export default router;
