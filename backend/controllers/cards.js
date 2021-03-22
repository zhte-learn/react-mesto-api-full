const Card = require('../models/card');
const handleError = require('../handleError');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
  //Card.create({ name, link, owner: { _id: req.user._id } })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err._message === 'card validation failed') {
        res.status(400).send({ message: 'Введены неверные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(cardId)
          .orFail(() => new Error('Not found'))
          .then((data) => res.send(data))
          .catch((err) => handleError(err, res));
      } else {
        res.status(403).send({ message: 'Можно удалять только свои карточки' });
      }
    })
    .catch((err) => handleError(err, res));
};

const likeCard = (req, res) => {
  console.log(req)
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, {
    runValidators: true,
    new: true,
  })
    .orFail(() => new Error('Not found'))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, {
    runValidators: true,
    new: true,
  })
    .orFail(() => new Error('Not found'))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
