var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Poll = mongoose.model('Poll');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  res.locals.successes = req.flash("success");
  next();
});

router.get('/', function(req, res) {
  res.render('index', { user: req.user, session: JSON.stringify(req.session) });
});

router.get('/login', function(req, res) {
  // if(req.app.get("env") === "development"){
  //   User.findOne({ email: "diogorighi@gmail.com" }, function(err, doc){
  //     req.logIn(doc, function(err) {
  //       if(err){ return next(err); }
  //       return res.redirect("/profile")
  //     })
  //   });
  //   return;
  // }
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
  successFlash: true
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