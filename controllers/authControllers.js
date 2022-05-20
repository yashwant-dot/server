const User = require('../models/User');
const jwt = require('jsonwebtoken');

const maxTime = 3 * 24 * 60 * 60;

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxTime * 1000 });
    res.status(200).json({ user_id: user._id, user_email: user.email, token: token });
  } catch(err) {
    res.status(400).json({err});
  }
}

module.exports.signUp_get = (req, res) => {
  res.render('signup');
}

module.exports.signUp_post = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxTime * 1000 });
    res.status(201).json({ user: user._id });

  } catch (error) {
    const err = handleError(error);
    res.status(400).send({ errors: err });
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });        // giving the jwt cookie blank value and age of 1ms.
  // res.redirect('/');
}

// Handling all errors
function handleError(error) {
  // console.log(error.message, error.code);
  let allErrors = { email: '', password: '' }

  // Invalid email -- login
  if(error.message === 'Email does not exit') {
    allErrors.email = 'Email does not exit';
  }
  // Incorrect password -- login
  if(error.message === 'Incorrect Password!') {
    allErrors.password = 'Incorrect Password';
  }

  // duplicate email error while signing --- Handling unique attribute of email.
  if(error.code === 11000) {
    allErrors.email = 'This email is already registered';
    return allErrors;
  }

  // validation errors
  if(error.message.includes('user validation failed')) {
    
    Object.values(error.errors).forEach(({ properties }) => {
      allErrors[properties.path] = properties.message;
    });
  }

  return allErrors;
}

// Create json web token
function createToken(id) {
  return jwt.sign({ id }, 'this is my secret', { expiresIn: maxTime });
}