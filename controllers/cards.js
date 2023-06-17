const Card = require('../models/card');
const {
  RES_CODE_CREATED,
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_FORBIDDEN,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_CODE_DEFAULT)
      .send({ message: defaultErrorMessage }));
};

const createCard = (req, res) => {
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
        res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(ERROR_CODE_DEFAULT)
          .send({ message: defaultErrorMessage });
      }
    });
};

const likeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(ERROR_CODE_DEFAULT)
        .send({ message: defaultErrorMessage });
    });
};

const dislikeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      }

      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные карточки' });
      }

      return res.status(ERROR_CODE_DEFAULT)
        .send({ message: defaultErrorMessage });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      }
      if (card.owner !== req.user._id) {
        res.status(ERROR_CODE_FORBIDDEN)
          .send({ message: 'Вы не можете удалять карточки других пользователей' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(ERROR_CODE_DEFAULT)
          .send({ message: defaultErrorMessage });
      }
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
