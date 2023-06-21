const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const router = require('./routes');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const handleErrors = require('./middlewares/handleErrors');

const { validationSignin, validationSignup } = require('./validation/validation');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

app.use(express.json());
app.post('/signin', validationSignin, login);
app.post('/signup', validationSignup, createUser);
app.use(auth);
app.use(router);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
// eslint-disable-next-line eol-last
});