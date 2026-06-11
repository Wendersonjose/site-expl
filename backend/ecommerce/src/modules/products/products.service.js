import { AppError } from '../../shared/AppError.js';
import * as categoryRepository from '../categories/categories.repository.js';
import * as productRepository from './products.repository.js';
import { toProductDTO } from './products.mapper.js';
import { parseId, validateProductPayload } from './products.validation.js';

/**
 * Converte os filtros recebidos via query string em valores tipados que o
 * repositório entende.
 */
function parseFilters(query = {}) {
  const filters = {};

  if (query.search) {
    filters.search = String(query.search).trim();
  }

  if (query.categoria !== undefined) {
    filters.categoria = Number(query.categoria);
  }

  if (query.ativo !== undefined) {
    filters.ativo = query.ativo === 'true' || query.ativo === true;
  }

  return filters;
}

function normalizeImages(imagens) {
  if (!Array.isArray(imagens)) {
    return [];
  }

  return imagens
    .filter((image) => image && image.url)
    .map((image) => ({ url: String(image.url).trim(), principal: Boolean(image.principal) }));
}

function normalize(payload) {
  return {
    nome: payload.nome.trim(),
    descricao: payload.descricao?.trim() || null,
    precoVenda: Number(payload.precoVenda),
    custoUnitario: Number(payload.custoUnitario),
    estoque: Number(payload.estoque ?? 0),
    idCategoria: Number(payload.idCategoria),
    ativo: payload.ativo ?? true,
    imagens: normalizeImages(payload.imagens),
  };
}

async function ensureCategoryExists(idCategoria) {
  const category = await categoryRepository.findById(idCategoria);

  if (!category) {
    throw AppError.notFound('Categoria não encontrada');
  }
}

export async function listProducts(query) {
  const rows = await productRepository.findAll(parseFilters(query));
  return rows.map(toProductDTO);
}

export async function getProductById(id) {
  const productId = parseId(id);
  const row = await productRepository.findById(productId);

  if (!row) {
    throw AppError.notFound('Produto não encontrado');
  }

  return toProductDTO(row);
}

export async function createProduct(payload) {
  validateProductPayload(payload);
  const product = normalize(payload);
  await ensureCategoryExists(product.idCategoria);

  const row = await productRepository.create(product);
  return toProductDTO(row);
}

export async function updateProduct(id, payload) {
  const productId = parseId(id);
  validateProductPayload(payload, { partial: true });

  const current = await productRepository.findById(productId);

  if (!current) {
    throw AppError.notFound('Produto não encontrado');
  }

  const idCategoria =
    payload.idCategoria !== undefined ? Number(payload.idCategoria) : current.id_categoria;

  if (payload.idCategoria !== undefined) {
    await ensureCategoryExists(idCategoria);
  }

  // Mescla o estado atual com os campos enviados (atualização parcial).
  const merged = {
    nome: payload.nome?.trim() ?? current.nome,
    descricao:
      payload.descricao !== undefined ? payload.descricao?.trim() || null : current.descricao,
    precoVenda: payload.precoVenda !== undefined ? Number(payload.precoVenda) : Number(current.preco_venda),
    custoUnitario:
      payload.custoUnitario !== undefined ? Number(payload.custoUnitario) : Number(current.custo_unitario),
    estoque: payload.estoque !== undefined ? Number(payload.estoque) : current.estoque_atual,
    idCategoria,
    ativo: payload.ativo !== undefined ? Boolean(payload.ativo) : Boolean(current.ativo),
    imagens: payload.imagens !== undefined ? normalizeImages(payload.imagens) : undefined,
  };

  const row = await productRepository.update(productId, merged);
  return toProductDTO(row);
}

export async function deleteProduct(id) {
  const productId = parseId(id);
  const deleted = await productRepository.remove(productId);

  if (!deleted) {
    throw AppError.notFound('Produto não encontrado');
  }
}
