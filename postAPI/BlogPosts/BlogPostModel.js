const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: true
	},
	userText: {
		type: String,
		required: true
	},
	createOn: {
		type: Date,
		required: true,
		default: Date.now
	}
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);