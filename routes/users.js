const router = require('express').Router();

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

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:userId', validationUserId, getUserById);

router.patch('/me', validationUpdateProfile, updateUser);

router.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
