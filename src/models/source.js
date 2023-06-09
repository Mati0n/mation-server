const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true }, // драйвер, связанный с источником
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: false }, // флаг, указывающий, активен ли источник
  isEnabled: { type: Boolean, default: true }, // флаг, указывающий, доступен ли источник
  controlEnabled: { type: Boolean, default: true }, // флаг, указывающий, доступно ли управление зоной через панель
  isVisible: { type: Boolean, default: true }, // флаг, указывающий, видим ли источник на панели
  zones: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }], default: [] }, // зоны, связанные с источником
});

module.exports = mongoose.model('Source', SourceSchema);