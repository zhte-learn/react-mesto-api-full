const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const handleError = require('../handleError');
const NotFoundError = require('../errors.js/not-found-error');

const SALT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const JWT_SECRET_KEY = 'ffc2f4e0dd81be0874443aa99c4aab0041d6fe55d09a6d5777e459ea8f7445d6';

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const addUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или пароль' });
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
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      }
      res.status(500).send({ message: 'Произошла ошибка, не удалось зарегистрировать пользователя' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

const getUserMe = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

const updateUserInfo = (req, res) => {
  console.log(req.user);
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    //.orFail(() => new Error('Not found'))
    .orFail(() => throw new NotFoundError('Not found'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или пароль' });
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }
      return {
        user,
        matched: bcrypt.compare(password, user.password),
      };
    })
    .then(({ user, matched }) => {
      console.log(user);
      if (!matched) {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });

      return res.status(200).send({ token: token });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка, не удалось авторизовать пользователя' });
    });
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
