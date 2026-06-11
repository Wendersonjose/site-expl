import * as authService from './auth.service.js';

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: 'Cadastro criado com sucesso',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}
