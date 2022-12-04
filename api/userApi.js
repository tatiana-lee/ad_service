const express = require('express');
const bcrypt = require('bcryptjs');
const { passport } = require('../passport-config');
const UserModule = require('../models/user/userFunctions');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
  const { email, password, name, contactPhone } = req.body;
  try {
    const checkEmail = await UserModule.findByEmail(email);
    if (checkEmail) {
      return res.status(400).json({
        error: 'email занят',
        status: 'error',
      });
    }
    const hashPassword = bcrypt.hashSync(password, 8);
    const newUser = await UserModule.create({
      email,
      password: hashPassword,
      name,
      contactPhone,
    });
    await newUser.save();
    res.json({
      data: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        contactPhone: newUser.contactPhone,
      },
      status: 'ok',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/signin', (req, res, next) => {
  passport.authenticate('local', (error, user) => {
    if (error) {
      return res.json({
        error: 'Неверный логин или пароль',
        status: 'error',
      });
    }

    req.login(user, function (error) {
      if (error) {
        return res.json({
          error: 'Неверный логин или пароль',
          status: 'error',
        });
      }
      req.session.authenticated = true;
      const data = {
        id: user._id,
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      };
      return res.json(data);
    });
  })(req, res, next);
});

app.post('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'вы успешно вышли', status: 'ok' });
});

module.exports = app;
