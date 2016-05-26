var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Poll = mongoose.model('Poll');

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

router.get('/new', isLoggedIn, function(req, res) {
	res.render('polls/new');
});

router.post('/', isLoggedIn, function(req, res) {
	var body = req.body;
	var user = req.user;
	
	var poll = new Poll();
	poll.title = body.title;
	poll.options.push({
		title: body.option_1
	});
	poll.options.push({
		title: body.option_2
	});
	poll.author = user._id;
	poll.save(function(err, doc){
		if(err) { return res.status(400).json(err); }
		console.log(doc + 'saved!')
		res.redirect('/profile');
	});
});

router.post('/:poll_id/:option_id', function(req, res){
	var pollId = req.params.poll_id;
	var optionId = req.params.option_id;
	Poll.findOne({ "options._id": optionId }, {
   "options.$.": 1
}, function(err, doc) {
		if(err) { return res.status(400).json(err); }
		res.json(doc);
	});
});

module.exports = router;
