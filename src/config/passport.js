var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model("User");
var flash = require('connect-flash');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
    passReqToCallback: true
	},
	function(req, email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (user) { 
      	return done(null, false, { message: "this e-mail is already taken!" }); 
      } else {
      	var newUser = new User();
      	newUser.email = email;
      	newUser.password = newUser.generateHash(password);

      	newUser.save(function(err) {
	        if (err) { throw err; }
          return done(null, newUser);
        });
      }
    });
  }
));

passport.use('local-login',new LocalStrategy(
	{
		usernameField: 'email',
    passReqToCallback: true
	},
	function(req, email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err, { message: "something went wrong. try again." }); }
      if (!user) { return done(null, false, { message: "This user do not exist!" }); }
      if (!user.verifyPassword(password)) { return done(null, false, { message: "Invalid Password!" }); }
      return done(null, user, { message: "You are logged in!" });
    });
  }
));
