import { AppError } from '../../shared/AppError.js';
import * as categoryRepository from './categories.repository.js';

function normalizarNomeCategoria(nomeCategoria) {
  if (typeof nomeCategoria !== 'string' || nomeCategoria.trim().length < 2) {
    throw AppError.badRequest('O nome da categoria deve ter pelo menos 2 caracteres');
  }

  return nomeCategoria.trim();
}

/**
 * Valida e normaliza o id numérico de categoria recebido na rota.
 */
export function parseId(id) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw AppError.badRequest('ID de categoria inválido');
  }

  return numericId;
}

function toCategoryDTO(row) {
  return { id: row.id_categoria, nomeCategoria: row.nome_categoria };
}

export async function buscarCategorias() {
  const categories = await categoryRepository.findAll();
  return categories.map(toCategoryDTO);
}

export async function criarCategoria(nomeCategoria) {
  const nome = normalizarNomeCategoria(nomeCategoria);

  if (await categoryRepository.existsByName(nome)) {
    throw AppError.conflict('Já existe uma categoria com esse nome');
  }

  const created = await categoryRepository.create(nome);
  return toCategoryDTO(created);
}

export async function excluirCategoria(id) {
  const categoryId = parseId(id);
  const deleted = await categoryRepository.remove(categoryId);

  if (!deleted) {
    throw AppError.notFound('Categoria não encontrada');
  }
}
