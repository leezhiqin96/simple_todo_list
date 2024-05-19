const createError = require('http-errors');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: true });
const RequestIp = require('@supercharge/request-ip');
const routes = require('./config/routes')

const logger = require('morgan');

require('dotenv').config();
require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');

global.appRoot = path.resolve(__dirname);

global.timeZone = typeof process.env.TIMEZONE == 'undefined' ? 'Asia/Singapore' : process.env.TIMEZONE;
global.siteUrl = typeof process.env.SITE_URL == 'undefined' ? '/' : process.env.SITE_URL;
global.cookieExpiry = typeof process.env.COOKIE_EXPIRY == 'undefined' ? ((1000 * 60 * 60 * 24) * 30) : process.env.COOKIE_EXPIRY; // one day * 30
global.__basedir = __dirname;

process.on('unhandledRejection', (reason, p) => {
  console.error('----Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error(`----Caught exception: ${error}\n` + `Exception origin: ${error.stack}`);
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' })); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // automatically parses incoming URL-encoded form data and exposes it in req.body
app.use(cookieParser());
app.use(csrfProtection); // Apply CSRF protection to all routes
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  // setup for user agent and ip
  req.ua = req.get('User-Agent');
  req.ip = RequestIp.getClientIp(req)
  next();
});

// Routers setup
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
