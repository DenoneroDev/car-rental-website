const mongoose = require("mongoose");

const confirmation = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Confirmations", confirmation);
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/
