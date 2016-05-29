// --------------------------
// Modules

var mongoose = require('mongoose');

// --------------------------
// Models

var User = mongoose.model("User");
var Poll = mongoose.model("Poll");

// --------------------------
// Functions

module.exports.home = function(req, res) {
  res.render('index', { user: req.user, session: JSON.stringify(req.session) });
};

module.exports.profile = function(req, res) {
  Poll.find({ author: req.user._id }).exec(function(err, docs){
    res.render('index/profile', { user: req.user, polls: docs });
  });
};

module.exports.signup = function(req, res) {
  res.render('index/signup');
};

module.exports.login = function(req, res) {
  //
  // I don't want to login everytime I restart the server!
  //
  if(req.app.get("env") === "development"){
    User.findOne({ email: process.env.DEV_EMAIL }, function(err, doc){
      req.logIn(doc, function(err) {
        if(err){ return res.status(500).send(err); }
        return res.redirect("/profile");
      });
    });
    return;
  }
  res.render('index/login');
};

module.exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
