const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
// const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
// const { validationSignin, validationSignup } = require('../validation/validation');
const NotFoundError = require('../errors/notFoundError');

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
// router.post('/signin', validationSignin, login);
// router.post('/signup', validationSignup, createUser);

router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Профиль не найден'));
});

module.exports = router;
