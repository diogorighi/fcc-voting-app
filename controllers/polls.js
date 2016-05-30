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

  //populate options
  body.options.forEach(function(option){
      poll.options.push({	title: option });
  });

	poll.author = user._id;

	poll.save(function(err, doc){
		if(err) { return res.status(500).send(err); }
    req.flash("success", "Your poll was created!");
		res.redirect('/polls/success/' + doc._id);
	});
};

module.exports.updateOption = function(req, res) {
  var optionTitle = req.body.option;
  var pollId = req.body.poll;

  Poll.findOneAndUpdate(
    { "_id": pollId, "options.title": optionTitle },
    {
        "$inc": {
            "options.$.votes": 1
        }
    },
    function(err, doc) {
      if(err) { return res.status(500).send(err); }
      if(doc === null) {
        Poll.findOne({ "_id": pollId }, function(err, doc){
          if(err) { return res.status(500).send(err); }
          doc.options.push({
            title: optionTitle,
            votes: 1
          });
          doc.save(function(err, doc){
            if(err) { return res.status(500).send(err); }
            req.flash("success", "Vote computed!");
            res.redirect('/polls/' + pollId);
          });
        });
      } else {
        req.flash("success", "Vote computed!");
        res.redirect('/polls/' + doc._id);
      }
    }
  );
};

module.exports.createdWithSuccess = function(req, res) {
  var pollId = req.params.id;

  Poll.findOne({ _id: pollId }, function(err, doc){
    if(err) { return res.status(500).send(err); }
    if(!doc) { return res.status(400).send('Poll not found'); }
    res.render('polls/success', { poll: doc });
  });
};

module.exports.show = function(req, res) {
  var pollId = req.params.id;

  Poll.findOne({ _id: pollId }, function(err, doc){
    if(err) { return res.status(500).send(err); }
    if(!doc) { return res.status(400).send('Poll not found'); }
    res.render('polls/show', { poll: doc });
  });
};

module.exports.vote = function(req, res) {
  var pollId = req.params.id;

  Poll.findOne({ _id: pollId }, function(err, doc){
    if(err) { return res.status(500).send(err); }
    if(!doc) { return res.status(400).send('Poll not found'); }
    res.render('polls/vote', { poll: doc });
  });
};

module.exports.deletePoll = function(req, res) {
  var pollId = req.params.id;

  console.log(pollId);

  Poll.findById(pollId, function(err, poll) {
    poll.remove(function(err){
      if(err) { return res.status(500).send('There was and error deletig your poll.'); }
      res.json({
        message: "Poll Deleted!",
        success: true
      });
    });
  });
};
