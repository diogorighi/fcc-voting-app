/* jshint node: true */
"use strict";

// ----------------------------------
// Modules

var express   = require('express');
var router    = express.Router();
var mongoose  = require('mongoose');
var passport  = require('passport');
var flash     = require('connect-flash');
var session   = require('express-session');

// ----------------------------------
// Models

var User = mongoose.model('User');
var Poll = mongoose.model('Poll');

// ----------------------------------
// Controllers

var ctrlIndex = require('../controllers/index');

// ----------------------------------
// Middlewares

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  res.locals.successes = req.flash("success");
  next();
});

// ----------------------------------
// Routes for /

router.get('/', ctrlIndex.home);
router.get('/profile', isLoggedIn, ctrlIndex.profile);

router.get('/signup', ctrlIndex.signup);
router.get('/login', ctrlIndex.login);
router.get('/logout', ctrlIndex.logout);

// ----------------------------------
// Functions

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
