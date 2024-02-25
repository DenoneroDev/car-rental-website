const mongoose = require("mongoose");

const car = new mongoose.Schema({
  uuid: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  images: {
    type: [Object],
    default: ["/uploads/temp/default.png"],
  },
  description: {
    type: String,
    required: true,
  },
  mark: {
    type: String,
    required: true,
  },
  markAliases: {
    type: [String],
  },
  model: {
    type: String,
    required: true,
  },
  packets: {
    type: [String],
  },
  color: {
    type: String,
    required: true,
  },
  fuel: {
    type: String,
    required: true,
  },
  transmission: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  power: {
    type: Number,
    required: true,
  },
  doors: {
    type: Number,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 3,
    float: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  stars: {
    type: Number,
    default: 0,
  },
  details: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  keywords: {
    type: [String],
  },
  rentedUntil: {
    type: Date,
  },
  de: {
    type: Object,
  },
  cs: {
    type: Object,
  },
});

module.exports = mongoose.model("Cars", car);
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/
