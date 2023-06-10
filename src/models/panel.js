const mongoose = require('mongoose');

const PanelSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
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
  activeSource: {
    type: Array,
    default: []
  },
  activeZone: {
    type: String,
    default: ''
  },
  socketId: String
});

module.exports = mongoose.model('Panel', PanelSchema);
