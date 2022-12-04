const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const { passport } = require('./passport-config');
const userApi = require('./api/userApi');
const adApi = require('./api/adApi');
const chatApi = require('./api/chatApi');
const socket = require('./socket/index');

const app = express();

const sessionMiddleware = session({
  secret: 'SECRET',
  credentials: true,
  resave: false,
  saveUninitialized: false,
});
const passportInitMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(passportInitMiddleware);
app.use(passportSessionMiddleware);

app.use('/api/user', userApi);
app.use('/api/advertisements', adApi);
app.use('/api/chat', chatApi);

const PORT = process.env.PORT || 3000;
const MONGODB_URL =
  process.env.MONGODB_URL || 'mongodb://root:example@mongo:27017/';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'ad_service';

const start = async (PORT, MONGODB_URL) => {
  try {
    await mongoose.connect(MONGODB_URL, { dbName: MONGODB_DATABASE });
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    socket(server, sessionMiddleware);
  } catch (error) {
    console.log(error);
  }
};

start(PORT, MONGODB_URL);
