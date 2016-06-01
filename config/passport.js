var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
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
    User.findOne({ "local.email": email }, function (err, user) {
      if (err) { return done(err); }
      if (user) {
      	return done(null, false, { message: "this e-mail is already taken!" });
      } else {
      	var newUser = new User();
        newUser.name = req.body.name;
      	newUser.local.email = email;
      	newUser.local.password = newUser.generateHash(password);

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

passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://nameless-shelf-74727.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      console.log(profile);
      User.findOne({ "github.id": profile.id }, function (err, user) {
        if (err) { return done(err, { message: "something went wrong. try again." }); }
        if(!user) {
          var newUser = User();
          newUser.name = profile.displayName;
          if(profile.emails > 0) {
              newUser.local.email = profile.emails[0].value;
          }
          newUser.github.id = profile.id;
          if(profile.photos > 0) {
              newUser.github.photo = profile.photos[0].value;
          }
          newUser.save(function(err){
            if(err) { throw err; }
            return done(null, newUser);
          });
        } else {
          return done(err, user);
        }
      });
    });
  }
));
