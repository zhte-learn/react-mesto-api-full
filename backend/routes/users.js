const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  getUserMe,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/me', getUserMe);

usersRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), getUserById);

usersRouter.put('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

usersRouter.put('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?#?$/),
  }),
}), updateUserAvatar);

module.exports = usersRouter;
