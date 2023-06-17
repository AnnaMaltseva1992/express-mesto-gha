const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { ERROR_CODE_NOT_FOUND } = require('../errors/errors');
const auth = require('../middlewares/auth');

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND)
    .send({ message: 'Профиль не найден' });
});

module.exports = router;
