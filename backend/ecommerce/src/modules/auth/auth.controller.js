import * as authService from './auth.service.js';
import { ok, created } from '../../shared/httpResponse.js';

export async function register(req, res) {
  const result = await authService.register(req.body);
  return created(res, result);
}

export async function login(req, res) {
  const result = await authService.login(req.body);
  return ok(res, result);
}

export async function me(req, res) {
  // req.user é preenchido pelo middleware authenticate.
  return ok(res, { id: req.user.sub, email: req.user.email, perfil: req.user.perfil });
}
