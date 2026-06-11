import * as categoryService from './categories.service.js';
import { created, ok } from '../../shared/httpResponse.js';

export async function listCategories(_req, res) {
  const categories = await categoryService.buscarCategorias();
  return ok(res, categories, { message: 'Categorias listadas com sucesso' });
}

export async function createCategory(req, res) {
  const category = await categoryService.criarCategoria(req.body.nomeCategoria);
  return created(res, category, 'Categoria criada com sucesso');
}

export async function deleteCategory(req, res) {
  await categoryService.excluirCategoria(req.params.id);
  return ok(res, null, { message: 'Categoria excluída com sucesso' });
}
