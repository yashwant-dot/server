const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {

  const token = req.cookies.jwt;

  if(!token) {
    res.redirect('/login');
  }

  jwt.verify(token, 'this is my secret', (err, decodedToken) => {
    if(err) {
      res.redirect('/login');
    } else {
      next();
    }
  });
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if(token) {
    jwt.verify(token, 'this is my secret', async (err, decodedToken) => {
      if(err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;       // Passing information to views by creating variable user.
        next();
      }
    });
  } 
  else {
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkUser };