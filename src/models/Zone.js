const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true, default: '' },
  description: { type: String, default: '' },
  sources: { type: Array, default: [] }, // устройства в зоне
  devices: { type: Array, default: [] }, // устройства в зоне
  controlledBy: { type: Array, default: [] }, // панели управляемые этой зоной
  isActive: { type: Boolean, default: false }, // флаг, указывающий, активна ли зона
  isVisible: { type: Boolean, default: true }, // флаг, указывающий, активна ли зона
  isEnabled: { type: Boolean, default: true }, // флаг, указывающий, доступна ли зона
  floor: { type: String, default: '' }, // этаж, на котором находится зона
  space: { type: String, default: '' }, // пространство, к которому относится зона
  volumeBar: { // параметры панели управления громкостью в зоне
    type: Object, default: {
      "visible": false,
      "template": 0,
      "volume": 0.0,
      "mute": false
    }
  },
  settings: { type: Object, default: {} } // настройки зоны
});

module.exports = mongoose.model('Zone', ZoneSchema);