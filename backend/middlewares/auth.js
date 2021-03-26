const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');
const ValidationError = require('../errors/validation-error');

//const JWT_SECRET_KEY = 'ffc2f4e0dd81be0874443aa99c4aab0041d6fe55d09a6d5777e459ea8f7445d6';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ValidationError('Не передан email или пароль');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    //payload = jwt.verify(token, JWT_SECRET_KEY);
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
