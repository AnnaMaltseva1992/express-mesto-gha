const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const { RES_CODE_CREATED } = require('../errors/errors');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

// const {
//   ERROR_CODE_INCORRECT_DATA,
//   ERROR_CODE_NOT_FOUND,
//   ERROR_CODE_DEFAULT,
//   defaultErrorMessage,
// } = require('../errors/errors');

const getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
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
            return next(new BadRequestError('Переданы некорректные данные пользователя'));
          } if (err.code === 11000) {
            return next(new ConflictError('Выбранный вами email уже используется'));
          }
          return next(err);
        });
    });
};

const updateUser = (req, res, next) => {
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
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные профиля'));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
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
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные профиля'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
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