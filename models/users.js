/* jslint node: true */
"use strict";

var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

var userSchema = new mongoose.Schema({
	name: String,
	local: {
		email: { type: String, unique: true },
		password: String
	},
	github: {
		id: String,
		photo: String
	},
	createdAt: { type: Date, default: Date.now }
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.verifyPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

mongoose.model("User", userSchema);
