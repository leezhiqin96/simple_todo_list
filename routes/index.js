const express = require('express');
const router = express.Router();

router.route('/')
  .get(async function (req, res, next) {
    res.render('index', { title: 'Home' })
  });

module.exports = router
