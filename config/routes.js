const express = require('express');
const router = express.Router();
const generateViewData = require('../middleware/generateViewData');

const UserController = require('../controllers/userController.controller');

// ==== Views ====
router.route('/login')
  .get(function (req, res, next) {
    res.render('login', { title: 'Login', csrfToken: req.csrfToken() });
  })
  .post(UserController.loginUser);

router.route('/')
  .get(generateViewData, async function (req, res, next) {
    res.render('index', { title: 'Home', viewData: req.viewPackage})
  });

// === Requests ===  
router.get('/logout', UserController.logoutUser);

router.route('/users')
  .post(UserController.createUser);

router.get('/users/check', UserController.checkUserExists);


module.exports = router
