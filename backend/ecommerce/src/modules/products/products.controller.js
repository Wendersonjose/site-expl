import * as productService from './products.service.js';
import { ok, created, noContent } from '../../shared/httpResponse.js';

export async function listProducts(req, res) {
  const products = await productService.listProducts(req.query);
  return ok(res, products);
}

export async function getProductById(req, res) {
  const product = await productService.getProductById(req.params.id);
  return ok(res, product);
}

export async function createProduct(req, res) {
  const product = await productService.createProduct(req.body);
  return created(res, product);
}

export async function updateProduct(req, res) {
  const product = await productService.updateProduct(req.params.id, req.body);
  return ok(res, product);
}

export async function deleteProduct(req, res) {
  await productService.deleteProduct(req.params.id);
  return noContent(res);
}
