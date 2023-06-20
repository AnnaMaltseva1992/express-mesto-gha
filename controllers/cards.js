const Card = require('../models/card');
const {
  RES_CODE_CREATED,
  // ERROR_CODE_INCORRECT_DATA,
  // ERROR_CODE_FORBIDDEN,
  // ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../errors/errors');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

const getCards = (req, res) => {
  Card
    .find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_CODE_DEFAULT)
      .send({ message: defaultErrorMessage }));
};

const createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(RES_CODE_CREATED)
      .send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      } return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const likeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      return res.status(ERROR_CODE_DEFAULT)
        .send({ message: defaultErrorMessage });
    });
};

const dislikeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(BadRequestError('Переданы некорректные данные карточки'));
      }

      return res.status(ERROR_CODE_DEFAULT)
        .send({ message: defaultErrorMessage });
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Вы не можете удалять карточки других пользователей'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      } return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
// eslint-disable-next-line eol-last
};
