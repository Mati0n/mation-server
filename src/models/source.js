const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: false },
  isEnabled: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  zones: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }], default: [] },
});

module.exports = mongoose.model('Source', SourceSchema);