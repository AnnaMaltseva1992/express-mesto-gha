const User = require('../models/user');

const getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res
      .status(200)
      .send(users))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

const getUserById = (req, res) => {
  User.findById(req.params._id)
    .orFail
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Bad Request' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404)
          .send({ message: 'User with _id cannot be found' });
      } return res.status(500)
        .send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(201)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Invalid data to create user' });
      } else {
        res.status(500)
          .send({ message: err.message });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
// eslint-disable-next-line eol-last
};