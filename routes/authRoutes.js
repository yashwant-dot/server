const { Router } = require('express');
const { login_post, login_get, signUp_post, signUp_get, logout_get } = require('../controllers/authControllers');

const router = Router();

router.get('/login',login_get);
router.post('/login',login_post);
router.get('/signup',signUp_get);
router.post('/signup',signUp_post);
router.get('/logout',logout_get);

// Setting the maximum age of cookie - 1day in ms.
// secure: true ---- means the cookie will only be send via secure network : https !!
// httpOnly: true ---- means we cannot access the cookie from front-end. Using document.cookie.
// router.get('/setCookie', (req, res) => {
//   res.cookie('newUser', false);
//   res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
//   res.send('Cookie is set');
// });

// router.get('/readCookie', (req, res) => {
//   const cookie = req.cookies;
//   res.json(cookie);
// });


module.exports = router;