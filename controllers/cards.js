const Card = require('../models/card');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

const getCards = (req, res, next) => {
  Card
    .find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
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
    .then((card) => res.status(201)
      .send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      } return next(err);
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
      return next(err);
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

      return next(err);
    });
};

const deleteCard = (req, res, next) => Card.findById(req.params.cardId)
  // eslint-disable-next-line consistent-return
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (!card.owner.equals(req.user._id)) {
      return next(new ForbiddenError('Вы не можете удалять карточки других пользователей'));
    }
    card.deleteOne()
      .then(() => res.send({ message: 'Карточка удалена' }))
      .catch(next);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные карточки'));
    } else {
      next(err);
    }
  });

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
// eslint-disable-next-line eol-last
};
