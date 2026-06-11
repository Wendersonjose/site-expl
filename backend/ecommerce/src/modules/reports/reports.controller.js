import { getReportData, getReportsDashboard, getReportsStatus } from './reports.service.js';
import { toCsv, toPdfBuffer } from './reports.exporters.js';

const REPORT_KEYS = [
  'faturamento-total',
  'ticket-medio',
  'produtos-mais-vendidos',
  'clientes-com-mais-compras',
  'estoque-baixo',
];

/**
 * Catálogo exibido em GET /reports — serve de documentação rápida das
 * rotas e filtros disponíveis.
 */
const reportsCatalog = [
  { method: 'GET', path: '/reports', description: 'Lista todos os relatórios disponíveis' },
  { method: 'GET', path: '/reports/status', description: 'Verifica API de relatórios e banco' },
  { method: 'GET', path: '/reports/dashboard', description: 'Resumo com todos os relatórios' },
  {
    method: 'GET',
    path: '/reports/faturamento-total',
    description: 'Faturamento total somando transacoes_financeiras.valor_recebido',
    filters: ['id_forma', 'id_pedido', 'codigo_externo'],
  },
  {
    method: 'GET',
    path: '/reports/ticket-medio',
    description: 'Ticket médio calculado a partir de pedidos.valor_total',
    filters: ['status', 'id_usuario', 'id_endereco', 'id_cupom'],
  },
  {
    method: 'GET',
    path: '/reports/produtos-mais-vendidos?limit=10',
    description: 'Produtos mais vendidos com base em itens_pedido',
    filters: ['id_produto', 'id_categoria', 'ativo', 'limit'],
  },
  {
    method: 'GET',
    path: '/reports/clientes-com-mais-compras?limit=10',
    description: 'Clientes com mais pedidos e maior valor acumulado',
    filters: ['id_usuario', 'perfil', 'data_inicio', 'data_fim', 'limit'],
  },
  {
    method: 'GET',
    path: '/reports/estoque-baixo?threshold=10&limit=20',
    description: 'Produtos com estoque igual ou abaixo do limite informado',
    filters: ['threshold', 'limit', 'id_categoria', 'ativo'],
  },
  ...REPORT_KEYS.flatMap((key) => [
    { method: 'GET', path: `/reports/${key}/export/csv`, description: `Exporta ${key} em CSV` },
    { method: 'GET', path: `/reports/${key}/export/pdf`, description: `Exporta ${key} em PDF` },
  ]),
];

/**
 * Fabrica o handler JSON de um relatório. O try/catch fica por conta do
 * asyncHandler aplicado nas rotas.
 */
export function createReportHandler(reportKey) {
  return async function reportHandler(req, res) {
    const report = await getReportData(reportKey, req.query);

    return res.status(200).json({
      success: true,
      message: `${report.title} carregado com sucesso`,
      data: report.data,
      filters: report.filters,
    });
  };
}

/**
 * Fabrica o handler de download (csv ou pdf) de um relatório.
 */
export function createDownloadHandler(reportKey, format) {
  return async function downloadHandler(req, res) {
    const report = await getReportData(reportKey, req.query);
    const fileName = `${report.filenameBase}.${format}`;

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.status(200).send(toCsv(report.data));
    }

    const pdfBuffer = await toPdfBuffer({
      title: report.title,
      subtitle: 'Exportação de relatório',
      data: report.data,
      filters: report.filters,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.status(200).send(pdfBuffer);
  };
}

export async function listReports(_req, res) {
  return res.status(200).json({
    success: true,
    message: 'Rotas de relatórios disponíveis',
    data: reportsCatalog,
  });
}

export async function reportsStatus(_req, res) {
  const data = await getReportsStatus();

  return res.status(200).json({
    success: true,
    message: 'API de relatórios funcionando corretamente',
    data,
  });
}

export async function reportsDashboard(_req, res) {
  const data = await getReportsDashboard();
  return res.status(200).json({ success: true, data });
}

export { REPORT_KEYS };
