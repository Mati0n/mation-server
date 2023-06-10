const { getIo } = require('../core/socketio');
const zoneModel = require('../models/zone');
const panelModel = require('../models/panel');

async function handleZoneSelect (params) {
  // Валидация входных параметров
  if (!params.id || !params.panelId) {
    throw new Error('Missing required parameters: id and panelId');
  }

  // Сохранение новых параметров в базу данных для панели и зоны
  const zone = await zoneModel.findByIdAndUpdate(params.id, { isActive: true }, { new: true });
  const panel = await panelModel.findByIdAndUpdate(params.panelId, { activeZone: params.id }, { new: true });

  // Отправка подробного статуса зоны на все активные панели в этой зоне
  const io = getIo();
  const activePanels = await panelModel.find({ activeZone: params.id });
  activePanels.forEach(panel => {
    io.to(panel.socketId).emit('updateUI', { activeZone: zone });
  });
}

module.exports = handleZoneSelect;
