const mongoose = require('mongoose');

const PanelSchema = new mongoose.Schema({
  panelId: {
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
  socketId: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Panel', PanelSchema);
