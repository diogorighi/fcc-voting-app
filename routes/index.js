var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Poll = mongoose.model('Poll');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { user: req.user, session: JSON.stringify(req.session) });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.get('/profile', isLoggedIn, function(req, res) {
  Poll.find({ author: req.user._id }).exec(function(err, docs){
    res.render('profile', { user: req.user, polls: docs });    
  })
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash: true,
  successFlashL: true
}));

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash: true
}));

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
