/* jshint node: true */
"use strict";

// ----------------------------------
// Modules

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('lodash');

// ----------------------------------
// Models

var User = mongoose.model('User');
var Poll = mongoose.model('Poll');

// ----------------------------------
// Controllers

var ctrlPolls = require('../controllers/polls');

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
// Routes to /polls

router.get('/new', isLoggedIn, ctrlPolls.new);
router.post('/', isLoggedIn, ctrlPolls.create);
router.get('/:id', ctrlPolls.show);
router.get('/vote/:id', ctrlPolls.vote);
router.get('/success/:id', ctrlPolls.createdWithSuccess);
router.post('/vote', ctrlPolls.updateOption);

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
