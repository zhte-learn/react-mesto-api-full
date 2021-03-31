const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cardsRouter = require('./routes/cards.js');
const usersRouter = require('./routes/users.js');
const { addUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

const corsOptions = {
  /* origin: '*', */
  origin: [
    'https://zhte-f.nomoredomains.icu',
    'http://zhte-f.nomoredomains.icu',
    /* 'http://localhost:3001', */
  ],
  methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
/* app.use('*', corsOptions); */

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?#?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), addUser);

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
