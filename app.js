const express = require('express');

const mongoose = require('mongoose');

const router = require('./routes');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

app.use(express.json());

app.use(router);

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
// eslint-disable-next-line eol-last
});