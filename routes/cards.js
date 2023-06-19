const cardRoutes = require('express').Router();
const {
  validationCreateCard,
  validationCardId,
} = require('../validation/validation');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', validationCreateCard, createCard);
cardRoutes.delete('/:cardId', validationCardId, deleteCard);
cardRoutes.put('/:cardId/likes', validationCardId, likeCard);
cardRoutes.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = cardRoutes;
