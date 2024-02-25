const mongoose = require("mongoose");

const page = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    footer: {
        type: Boolean,
        default: true,
    },
    navigation: {
        type: Boolean,
        default: true,
    }
});


module.exports = mongoose.model("Pages", page);
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/