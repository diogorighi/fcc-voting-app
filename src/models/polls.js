var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new mongoose.Schema({
	title: String,
	options: [{
		title: String,
		votes: { type: Number, default: 0 }
	}],
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	created: { type: Date, default: Date.now }
})

pollSchema.methods.addVote = function(option){
	this.options[option].votes += 1;
}

mongoose.model('Poll', pollSchema);
