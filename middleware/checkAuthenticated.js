const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.json({ error: 'требуется авторизация', status: 401 });
};

module.exports = checkAuthenticated;
