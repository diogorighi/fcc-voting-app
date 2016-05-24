'use strict';

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

var userSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		requred: true,
		unique: true
	},
	password: String
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.verifyPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

mongoose.model("User", userSchema);
