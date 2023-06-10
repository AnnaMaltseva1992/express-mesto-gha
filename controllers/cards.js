const Card = require('../models/card');

const getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.status(200)
      .send(cards))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404)
          .send({ message: 'Not found: Invalid _id' });
      }

      return res.status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .send({ message: 'Card with _id cannot be found' });
      } else {
        res.status(500)
          .send({ message: err.message });
      }
    });
};

const createCard = (req, res) => {
  const {
    name,
    link,
  } = req.body;
  console.log(req.user._id);
  Card
    .create({
      name,
      link,
    })
    .then((card) => res.status(201)
      .send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Invalid data for card creation' });
      } else {
        res.status(500)
          .send({ message: err.message });
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
        return res.status(404)
          .send({ message: 'Not found: Invalid _id' });
      }

      return res.status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Invalid data to add like' });
      }

      return res.status(500)
        .send({ message: err.message });
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
        return res.status(404)
          .send({ message: 'Not found: Invalid _id' });
      }

      return res.status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: 'Invalid data to delete like' });
      }

      return res.status(500)
        .send({ message: err.message });
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
