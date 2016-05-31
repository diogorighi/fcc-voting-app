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
// Github Authentication

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/',
    failureFlash: true
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.flash('success', 'Logged with github!');
    res.redirect('/profile');
  });

// ----------------------------------
// Functions

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    req.flash("error", "You have no authorization to do that. Please login.");
    res.redirect('/');
}

module.exports = router;
