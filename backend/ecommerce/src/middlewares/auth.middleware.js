import jwt from 'jsonwebtoken';

function unauthorized(res, message = 'Acesso nao autorizado') {
  return res.status(401).json({
    success: false,
    message,
  });
}

export function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return unauthorized(res, 'Token nao informado');
  }

  try {
    const token = authorization.slice(7);
    const secret = process.env.JWT_SECRET || 'explosion-dev-secret';
    req.user = jwt.verify(token, secret);
    return next();
  } catch (error) {
    return unauthorized(res, 'Token invalido ou expirado');
  }
}

export function authorizeAdmin(req, res, next) {
  if (req.user?.perfil !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso exclusivo para administradores',
    });
  }

  return next();
}
