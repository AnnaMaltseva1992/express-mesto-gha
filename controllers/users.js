const User = require('../models/user');
const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT)
      .send({ message: defaultErrorMessage }));
};

const getUserById = (req, res) => {
  User.findById(req.params._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Bad Request' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'User is not found' });
      } return res.status(ERROR_CODE_DEFAULT)
        .send({ message: defaultErrorMessage });
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
        res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Incorrect user data' });
      } else {
        res.status(ERROR_CODE_DEFAULT)
          .send({ message: defaultErrorMessage });
      }
    });
};

const updateUser = (req, res) => {
  const {
    name,
    about,
  } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'User is not found' });
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect profile data' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'User is not found' });
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect avatar data' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
// eslint-disable-next-line eol-last
};