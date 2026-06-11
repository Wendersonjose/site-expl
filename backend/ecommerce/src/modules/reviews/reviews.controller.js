import * as reviewService from './reviews.service.js';
import { ok, created } from '../../shared/httpResponse.js';

export async function listByProduct(req, res) {
  const data = await reviewService.listByProduct(req.params.idProduto);
  return ok(res, data);
}

export async function createReview(req, res) {
  const review = await reviewService.createReview(req.body, req.user.sub);
  return created(res, review, 'Avaliação registrada');
}
