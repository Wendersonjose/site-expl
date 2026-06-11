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

export async function forgotPassword(req, res) {
  const { devResetUrl } = await authService.requestPasswordReset(req.body?.email);

  // Resposta sempre genérica (não revela se o e-mail existe). Em dev,
  // devResetUrl vem preenchido para facilitar o teste.
  return ok(res, devResetUrl ? { devResetUrl } : null, {
    message: 'Se o e-mail estiver cadastrado, enviaremos um link de redefinição.',
  });
}

export async function resetPassword(req, res) {
  await authService.resetPassword(req.body ?? {});
  return ok(res, null, { message: 'Senha redefinida com sucesso. Faça login com a nova senha.' });
}
