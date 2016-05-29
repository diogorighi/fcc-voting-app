/* jshint node: true */
"use strict";

// ----------------------------------
// Modules

var mongoose = require("mongoose");

// ----------------------------------
// Models

var Poll = mongoose.model('Poll');

// ----------------------------------
// Functions

module.exports.new = function(req, res) {
  res.render('polls/new');
};

module.exports.create = function(req, res) {
  var body = req.body;
	var user = req.user;

	var poll = new Poll();

	poll.title = body.title;
	poll.options.push({	title: body.option_1 });
	poll.options.push({ title: body.option_2 });
	poll.author = user._id;

	poll.save(function(err, doc){
		if(err) { return res.status(500).send(err); }
    req.flash("success", "Your poll was created!");
		res.redirect('/profile');
	});
};

module.exports.updateOption = function(req, res) {
  var pollId = req.params.poll_id;
	var optionId = req.params.option_id;

  Poll.findOneAndUpdate(
    { "_id": pollId, "options._id": optionId },
    {
        "$inc": {
            "options.$.votes": 1
        }
    },
    function(err,doc) {
      if(err) { return res.status(500).send(err); }
      req.flash("success", "Vote computed!");
      res.redirect('/profile');
    }
  );
};
