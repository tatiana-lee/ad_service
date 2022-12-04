const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const UserModule = require('./models/user/userFunctions.js');
const User = require('./models/user/user');

const verify = async (email, password, done) => {
  try {
    const user = await UserModule.findByEmail(email);
    if (!user) {
      return done(null, false, {
        error: 'Неверный логин или пароль',
        status: 'error',
      });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return done(null, false, {
        error: 'Неверный логин или пароль',
        status: 'error',
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const options = {
  usernameField: 'email',
  passwordField: 'password',
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser(function (user, cb) {
  return cb(null, user._id);
});

passport.deserializeUser(async function (id, cb) {
  try {
    const user = await User.findById(id).select('-__v');
    if (!user) {
      return cb(null, false);
    }
    return cb(null, user);
  } catch (error) {
    cb(error);
  }
});
// };

module.exports = {
  passport: passport,
};
