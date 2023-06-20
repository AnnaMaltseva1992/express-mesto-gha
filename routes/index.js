const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const { ERROR_CODE_NOT_FOUND } = require('../errors/errors');
const auth = require('../middlewares/auth');
const { validationSignin, validationSignup } = require('../validation/validation');

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.post('/signin', validationSignin, login);
router.post('/signup', validationSignup, createUser);

router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND)
    .send({ message: 'Профиль не найден' });
});

module.exports = router;
