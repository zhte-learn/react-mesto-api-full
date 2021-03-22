const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  getUserMe,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUserMe);
usersRouter.get('/users/:userId', getUserById);
usersRouter.put('/users/me', updateUserInfo);
usersRouter.put('/users/me/avatar', updateUserAvatar);

module.exports = usersRouter;
