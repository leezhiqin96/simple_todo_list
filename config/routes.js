const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController.controller');

// ==== Views ====
router.route('/')
  .get(async function (req, res, next) {
    res.render('index', { title: 'Home' })
  });

router.route('/login')
  .get(function (req, res, next) {
    res.render('login', { title: 'Login', csrfToken: req.csrfToken() });
  })
  .post(UserController.loginUser);


  // === Requests ===  
router.post('/logout', UserController.logoutUser);

router.route('/users')
  .post(UserController.createUser);

router.get('/users/check', UserController.checkUserExists);


module.exports = router
