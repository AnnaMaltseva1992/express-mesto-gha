const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { ERROR_CODE_NOT_FOUND } = require('../errors/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND)
    .send({ message: 'Профиль не найден' });
});

module.exports = router;
