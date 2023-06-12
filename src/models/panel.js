const mongoose = require('mongoose');

const PanelSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  inOperation: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastSeen: Date,
  state: {
    type: String,
    default: 'inactive' // inactive, main, zone
  },
  activeSourceId: {
    type: Array,
    default: []
  },
  activeZoneId: {
    type: String,
    default: ''
  },
  socketId: String
});

module.exports = mongoose.model('Panel', PanelSchema);
