const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Профиль не найден'));
});

module.exports = router;
