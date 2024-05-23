const express = require('express');
const router = express.Router();
const generateViewData = require('../middleware/generateViewData');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');
const UserController = require('../controllers/userController.controller');

// ==== Views ====
router.route('/login')
  .get(isAuthenticated, function (req, res, next) {
    res.render('login', { title: 'Login', csrfToken: req.csrfToken() });
  })
  .post(UserController.loginUser);

router.route('/')
  .get([isAuthenticated, generateViewData], async function (req, res, next) {
    res.render('index', { title: 'Home', viewData: req.viewPackage })
  });

// === Requests ===
router.get('/users/check', UserController.checkUserExists);
router.post('/logout', UserController.logoutUser);

router.route('/users')
  .post(UserController.createUser);

router.route('/users/:userID/tasks')
  .get([isAuthenticated, isAuthorized], UserController.getUserTasks)
  .post([isAuthenticated, isAuthorized], UserController.addUserTask)
  .delete([isAuthenticated, isAuthorized], UserController.deleteUserTask);

router.route('/users/:userID/tasks/:taskID')
  .put([isAuthenticated, isAuthorized], UserController.updateUserTask)
  .post([isAuthenticated, isAuthorized], UserController.addUserSubtask)

module.exports = router
