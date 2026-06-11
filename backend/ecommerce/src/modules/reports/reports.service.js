import pool from '../../config/database.js';
import { AppError } from '../../shared/AppError.js';

/**
 * Relatórios gerenciais sobre o banco real (MySQL).
 * Portado da branch develop (autoria: Túlio, PR #31) — original em
 * PostgreSQL; convertido para MySQL e integrado ao AppError do projeto.
 */

async function queryReport(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

function toPositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function toOptionalPositiveInteger(value) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw AppError.badRequest(`Parâmetro numérico inválido: ${value}`);
  }

  return parsedValue;
}

function toOptionalBoolean(value) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalizedValue = String(value).trim().toLowerCase();

  if (['true', '1', 'sim', 'yes'].includes(normalizedValue)) {
    return true;
  }

  if (['false', '0', 'nao', 'não', 'no'].includes(normalizedValue)) {
    return false;
  }

  throw AppError.badRequest(`Parâmetro booleano inválido: ${value}`);
}

function normalizeText(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue ? normalizedValue : undefined;
}

function appendCondition(clauses, params, sqlSnippet, value) {
  if (value === undefined) {
    return;
  }

  params.push(value);
  clauses.push(`${sqlSnippet} ?`);
}

function buildWhereClause(clauses) {
  return clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
}

function buildReportPayload(title, filenameBase, data, filters = {}) {
  return { title, filenameBase, filters, data };
}

export async function getFaturamentoTotal(filters = {}) {
  const normalizedFilters = {
    id_forma: toOptionalPositiveInteger(filters.id_forma),
    id_pedido: toOptionalPositiveInteger(filters.id_pedido),
    codigo_externo: normalizeText(filters.codigo_externo),
  };

  const clauses = [];
  const params = [];

  appendCondition(clauses, params, 'id_forma =', normalizedFilters.id_forma);
  appendCondition(clauses, params, 'id_pedido =', normalizedFilters.id_pedido);
  appendCondition(clauses, params, 'codigo_externo =', normalizedFilters.codigo_externo);

  const [report] = await queryReport(
    `
      SELECT
        CAST(COALESCE(SUM(valor_recebido), 0) AS DOUBLE) AS faturamento_total,
        COUNT(*) AS total_transacoes
      FROM transacoes_financeiras
      ${buildWhereClause(clauses)}
    `,
    params,
  );

  return buildReportPayload('Faturamento total', 'faturamento-total', report, normalizedFilters);
}

export async function getTicketMedio(filters = {}) {
  const normalizedFilters = {
    status: normalizeText(filters.status),
    id_usuario: toOptionalPositiveInteger(filters.id_usuario),
    id_endereco: toOptionalPositiveInteger(filters.id_endereco),
    id_cupom: toOptionalPositiveInteger(filters.id_cupom),
  };

  const clauses = [];
  const params = [];

  appendCondition(clauses, params, 'status =', normalizedFilters.status);
  appendCondition(clauses, params, 'id_usuario =', normalizedFilters.id_usuario);
  appendCondition(clauses, params, 'id_endereco =', normalizedFilters.id_endereco);
  appendCondition(clauses, params, 'id_cupom =', normalizedFilters.id_cupom);

  const [report] = await queryReport(
    `
      SELECT
        CAST(COALESCE(AVG(valor_total), 0) AS DOUBLE) AS ticket_medio,
        COUNT(*) AS total_pedidos
      FROM pedidos
      ${buildWhereClause(clauses)}
    `,
    params,
  );

  return buildReportPayload('Ticket médio', 'ticket-medio', report, normalizedFilters);
}

export async function getProdutosMaisVendidos(filters = {}) {
  const normalizedFilters = {
    id_produto: toOptionalPositiveInteger(filters.id_produto),
    id_categoria: toOptionalPositiveInteger(filters.id_categoria),
    ativo: toOptionalBoolean(filters.ativo),
    limit: toPositiveInteger(filters.limit, 10),
  };

  const clauses = [];
  const params = [];

  appendCondition(clauses, params, 'p.id_produto =', normalizedFilters.id_produto);
  appendCondition(clauses, params, 'p.id_categoria =', normalizedFilters.id_categoria);
  appendCondition(clauses, params, 'p.ativo =', normalizedFilters.ativo);

  const data = await queryReport(
    `
      SELECT
        ip.id_produto,
        p.nome,
        p.id_categoria,
        CAST(p.preco_venda AS DOUBLE) AS preco_venda,
        CAST(p.custo_unitario AS DOUBLE) AS custo_unitario,
        p.estoque_atual,
        p.ativo,
        CAST(SUM(ip.quantidade) AS SIGNED) AS total_unidades_vendidas,
        COUNT(DISTINCT ip.id_pedido) AS total_pedidos
      FROM itens_pedido ip
      JOIN produtos p ON p.id_produto = ip.id_produto
      ${buildWhereClause(clauses)}
      GROUP BY ip.id_produto, p.nome, p.id_categoria, p.preco_venda, p.custo_unitario, p.estoque_atual, p.ativo
      ORDER BY total_unidades_vendidas DESC, ip.id_produto ASC
      LIMIT ?
    `,
    [...params, normalizedFilters.limit],
  );

  return buildReportPayload('Produtos mais vendidos', 'produtos-mais-vendidos', data, normalizedFilters);
}

export async function getClientesComMaisCompras(filters = {}) {
  const normalizedFilters = {
    id_usuario: toOptionalPositiveInteger(filters.id_usuario),
    perfil: normalizeText(filters.perfil),
    data_inicio: normalizeText(filters.data_inicio),
    data_fim: normalizeText(filters.data_fim),
    limit: toPositiveInteger(filters.limit, 10),
  };

  const clauses = [];
  const params = [];

  appendCondition(clauses, params, 'u.id_usuario =', normalizedFilters.id_usuario);
  appendCondition(clauses, params, 'u.perfil =', normalizedFilters.perfil);

  if (normalizedFilters.data_inicio) {
    params.push(normalizedFilters.data_inicio);
    clauses.push('DATE(u.data_criacao) >= ?');
  }

  if (normalizedFilters.data_fim) {
    params.push(normalizedFilters.data_fim);
    clauses.push('DATE(u.data_criacao) <= ?');
  }

  const data = await queryReport(
    `
      SELECT
        u.id_usuario,
        u.nome,
        u.email,
        u.perfil,
        u.data_criacao,
        COUNT(p.id_pedido) AS total_pedidos,
        CAST(COALESCE(SUM(p.valor_total), 0) AS DOUBLE) AS valor_total_comprado
      FROM usuarios u
      JOIN pedidos p ON p.id_usuario = u.id_usuario
      ${buildWhereClause(clauses)}
      GROUP BY u.id_usuario, u.nome, u.email, u.perfil, u.data_criacao
      ORDER BY total_pedidos DESC, valor_total_comprado DESC, u.nome ASC
      LIMIT ?
    `,
    [...params, normalizedFilters.limit],
  );

  return buildReportPayload(
    'Clientes com mais compras',
    'clientes-com-mais-compras',
    data,
    normalizedFilters,
  );
}

export async function getEstoqueBaixo(filters = {}) {
  const normalizedFilters = {
    threshold: toPositiveInteger(filters.threshold, 10),
    limit: toPositiveInteger(filters.limit, 20),
    id_categoria: toOptionalPositiveInteger(filters.id_categoria),
    ativo: toOptionalBoolean(filters.ativo),
  };

  const clauses = [];
  const params = [];

  appendCondition(clauses, params, 'p.id_categoria =', normalizedFilters.id_categoria);
  appendCondition(clauses, params, 'p.ativo =', normalizedFilters.ativo);

  const data = await queryReport(
    `
      SELECT
        p.id_produto,
        p.nome,
        p.id_categoria,
        CAST(p.preco_venda AS DOUBLE) AS preco_venda,
        CAST(p.custo_unitario AS DOUBLE) AS custo_unitario,
        p.estoque_atual,
        p.ativo
      FROM produtos p
      WHERE p.estoque_atual <= ?
      ${clauses.length ? `AND ${clauses.join(' AND ')}` : ''}
      ORDER BY p.estoque_atual ASC, p.id_produto ASC
      LIMIT ?
    `,
    [normalizedFilters.threshold, ...params, normalizedFilters.limit],
  );

  return buildReportPayload('Estoque baixo', 'estoque-baixo', data, normalizedFilters);
}

export async function getReportsDashboard() {
  const [faturamentoTotal, ticketMedio, produtosMaisVendidos, clientesComMaisCompras, estoqueBaixo] =
    await Promise.all([
      getFaturamentoTotal(),
      getTicketMedio(),
      getProdutosMaisVendidos({ limit: 5 }),
      getClientesComMaisCompras({ limit: 5 }),
      getEstoqueBaixo({ threshold: 10, limit: 10 }),
    ]);

  return {
    faturamento_total: faturamentoTotal.data,
    ticket_medio: ticketMedio.data,
    produtos_mais_vendidos: produtosMaisVendidos.data,
    clientes_com_mais_compras: clientesComMaisCompras.data,
    estoque_baixo: estoqueBaixo.data,
  };
}

export async function getReportsStatus() {
  const [report] = await queryReport(
    `
      SELECT
        TRUE AS api_working,
        DATABASE() AS database_name,
        CURRENT_USER() AS db_user,
        NOW() AS checked_at
    `,
  );

  return report;
}

export async function getReportData(reportKey, filters = {}) {
  switch (reportKey) {
    case 'faturamento-total':
      return getFaturamentoTotal(filters);
    case 'ticket-medio':
      return getTicketMedio(filters);
    case 'produtos-mais-vendidos':
      return getProdutosMaisVendidos(filters);
    case 'clientes-com-mais-compras':
      return getClientesComMaisCompras(filters);
    case 'estoque-baixo':
      return getEstoqueBaixo(filters);
    default:
      throw AppError.notFound(`Relatório "${reportKey}" não encontrado`);
  }
}
