var mongoose = require('mongoose');
var _ = require('lodash');
var Schema = mongoose.Schema;

var pollSchema = new mongoose.Schema({
	title: String,
	options: [{
		title: String,
		votes: { type: Number, default: 0 }
	}],
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	created: { type: Date, default: Date.now }
});

mongoose.model('Poll', pollSchema);
