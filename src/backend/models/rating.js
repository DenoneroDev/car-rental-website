const mongoose = require("mongoose");

const rating = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	stars: {
		type: Number,
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	de: {
		type: Object,
	},
	cs: {
		type: Object,
	},
	target: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Ratings", rating);
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/
