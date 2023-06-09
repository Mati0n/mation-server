const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  version: {
    major: Number,
    minor: Number,
    patch: Number,
    stage: String,
  },
  isCompatible: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Driver', driverSchema);