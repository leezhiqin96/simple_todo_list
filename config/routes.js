const express = require('express');
const router = express.Router();
const generateViewData = require('../middleware/generateViewData');
const { isAuthorized } = require('../middleware/auth');
const UserController = require('../controllers/userController.controller');

// ==== Views ====
router.route('/login')
  .get(function (req, res, next) {
    res.render('login', { title: 'Login', csrfToken: req.csrfToken() });
  })
  .post(UserController.loginUser);

router.route('/')
  .get(generateViewData, async function (req, res, next) {
    res.render('index', { title: 'Home', viewData: req.viewPackage })
  });

// === Requests ===
router.get('/users/check', UserController.checkUserExists);
router.post('/logout', UserController.logoutUser);

router.route('/users')
  .post(UserController.createUser);

router.route('/users/:userID/tasks')
  .get(isAuthorized, UserController.getUserTasks)
  .post(isAuthorized, UserController.addUserTask)
  .delete(isAuthorized, UserController.deleteUserTask);

router.route('/users/:userID/tasks/:taskID')
  .put(isAuthorized, UserController.updateUserTask)
  .post(isAuthorized, UserController.addUserSubtask)

module.exports = router
