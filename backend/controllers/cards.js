const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err._message === 'card validation failed') {
        next(new ValidationError('Введены некорректные данные'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => new NotFoundError('Запрашиваемый ресурс не найден'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(cardId)
          .orFail(() => new NotFoundError('Запрашиваемый ресурс не найден'))
          .then((data) => res.send(data))
          .catch((err) => next(err));
      } else {
        throw new ForbiddenError('Можно удалять только свои карточки');
      }
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, {
    runValidators: true,
    new: true,
  })
    .orFail(() => new NotFoundError('Запрашиваемый ресурс не найден'))
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, {
    runValidators: true,
    new: true,
  })
    .orFail(() => new NotFoundError('Запрашиваемый ресурс не найден'))
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
