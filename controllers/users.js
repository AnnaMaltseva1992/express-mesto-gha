const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

const getUser = (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(ERROR_CODE_DEFAULT)
        .send({ message: defaultErrorMessage });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные пользователя' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(ERROR_CODE_DEFAULT)
        .send({ message: defaultErrorMessage });
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(201)
          .send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(ERROR_CODE_INCORRECT_DATA)
              .send({ message: 'Переданы некорректные данные пользователя' });
          } else {
            res.status(ERROR_CODE_DEFAULT)
              .send({ message: defaultErrorMessage });
          }
        });
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
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'User is not found' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные профиля' });
      }
      return res.status(ERROR_CODE_DEFAULT)
        .send({ message: defaultErrorMessage });
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
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные профиля' });
      }
      return res.status(ERROR_CODE_DEFAULT)
        .send({ message: defaultErrorMessage });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
// eslint-disable-next-line eol-last
};