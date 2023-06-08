const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, default: '' },
  devices: { type: Array, default: [] },
  isActive: { type: Boolean, default: false },
  isEnabled: { type: Boolean, default: true },
  floor: { type: String, default: '' },
  space: { type: String, default: '' },
  volumeBar: {
    type: Object, default: {
      "visible": false,
      "template": 0,
      "volume": 0.0,
      "mute": false
    }
  },
  settings: { type: Object, default: {} }
});

module.exports = mongoose.model('Zone', ZoneSchema);