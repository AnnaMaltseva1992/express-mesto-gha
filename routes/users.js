const userRoutes = require('express').Router();

const {
  validationUserId,
  validationUpdateProfile,
  validationUpdateAvatar,
} = require('../validation/validation');

const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);

userRoutes.get('/me', getUser);

userRoutes.get('/:userId', validationUserId, getUserById);

userRoutes.patch('/me', validationUpdateProfile, updateUser);

userRoutes.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = userRoutes;
