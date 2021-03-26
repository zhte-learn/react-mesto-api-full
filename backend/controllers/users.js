const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');

const SALT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
//const JWT_SECRET_KEY = 'ffc2f4e0dd81be0874443aa99c4aab0041d6fe55d09a6d5777e459ea8f7445d6';

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

const addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new ValidationError('Не передан email или пароль');
  }

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(201).send({
      name,
      about,
      avatar,
      email,
    }))
    .catch((err) => {
      if (err._message === 'user validation failed') {
        next(new ValidationError('Введены некорректные данные'));
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
      next(err);
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Не передан email или пароль');
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ValidationError('Неправильные почта или пароль');
      }
      return {
        user,
        matched: bcrypt.compare(password, user.password),
      };
    })
    .then(({ user, matched }) => {
      if (!matched) {
        throw new ValidationError('Неправильные почта или пароль');
      }

      const token = jwt.sign(
        { _id: user._id },
        //JWT_SECRET_KEY,
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      return res.status(200).send({ token: token });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  addUser,
  getUserById,
  getUserMe,
  updateUserInfo,
  updateUserAvatar,
  login,
};
