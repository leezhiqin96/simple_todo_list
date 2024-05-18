const express = require('express');
const router = express.Router();

router.route('/')
  .get(async function (req, res, next) {
    res.render('index', { title: 'Home' })
  });

router.route('/login')
  .get(function (req, res, next) {
    res.render('login', { title: 'Login' });
  });


module.exports = router
