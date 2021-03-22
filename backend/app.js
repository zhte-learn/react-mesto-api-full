const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardsRouter = require('./routes/cards.js');
const usersRouter = require('./routes/users.js');
const { addUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', addUser);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

/* app.use((req, res) => {
  res.status(404);
  res.send({ message: 'Запрашиваемый ресурс не найден' });
}); */

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
