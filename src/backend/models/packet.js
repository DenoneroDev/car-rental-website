const mongoose = require("mongoose");

const packet = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    from: {
        type: Number,
        required: true,
    },
    to: {
        type: Number,
        required: false,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    extra: {
        type: Number,
    },
    vip: {
      type: Boolean,  
    },
    features: {
        type: [String],
        required: true,
    },
    de: {
        type: Object,
    },
    cs: {
        type: Object,
    }
});


module.exports = mongoose.model("Packets", packet);
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/