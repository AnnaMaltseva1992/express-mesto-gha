const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');
const { login, createUser } = require('../controllers/users');
const { validationSignin, validationSignup } = require('../validation/validation');

router.post('/signin', validationSignin, login);
router.post('/signup', validationSignup, createUser);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Профиль не найден'));
});

module.exports = router;
