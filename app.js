const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const helmet = require('helmet');

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

app.use(auth);

app.use(errors());
app.use(helmet());
app.use(handleErrors);

const router = require('./routes');

app.use(router);
app.post('/signin', validationSignin, login);
app.post('/signup', validationSignup, createUser);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
// eslint-disable-next-line eol-last
});