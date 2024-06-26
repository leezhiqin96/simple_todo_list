const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: true });
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./models');
const routes = require('./config/routes');
const logger = require('morgan');
const { isAuthenticated } = require('./middleware/auth');

require('dotenv').config();
require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');

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

// Set up session middleware
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
    expiration: 86400000
  }),
}));

// Sync the session store with Sequelize
sequelize.sync();

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
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
