const express = require('express');
const router = express.Router();
const generateViewData = require('../middleware/generateViewData');
const { isAuthenticated } = require('../middleware/auth');

const UserController = require('../controllers/userController.controller');

// ==== Views ====
router.route('/login')
  .get(function (req, res, next) {
    res.render('login', { title: 'Login', csrfToken: req.csrfToken() });
  })
  .post(UserController.loginUser);

router.route('/')
  .get([isAuthenticated, generateViewData], async function (req, res, next) {
    res.render('index', { title: 'Home', viewData: req.viewPackage })
  });

// === Requests ===
// Unprotected
router.get('/users/check', UserController.checkUserExists);

router.route('/users')
  .post(UserController.createUser);

//Protected
router.post('/logout', isAuthenticated, UserController.logoutUser);


router.route('/users/:userID/tasks')
  .get(isAuthenticated, UserController.getUserTasks)
  .post(isAuthenticated, UserController.addUserTask)
  .delete(isAuthenticated, UserController.deleteUserTask);

router.route('/users/:userID/tasks/:taskID')
  .put(isAuthenticated, UserController.updateUserTask)
  .post(isAuthenticated, UserController.addUserSubtask)

module.exports = router
