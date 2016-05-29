/* jshint node: true */
"use strict";

// ----------------------------------
// Modules

var express = require('express');
var router = express.Router();
var passport = require('passport');

// ----------------------------------
// Routes

router.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash: true,
      successFlash: true
    })
);

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash: true
}));

module.exports = router;
