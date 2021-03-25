const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');
const ValidationError = require('../errors/validation-error');

const JWT_SECRET_KEY = 'very_secret_key';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ValidationError('Не передан email или пароль');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
