const { getIo } = require('../core/socketio');
const zoneModel = require('../models/zone');
const panelModel = require('../models/panel');
const sourceModel = require('../models/source');
const driverModel = require('../models/driver');

async function handleSourceSelect (params) {
  // Валидация входных параметров
  if (!params.id || !params.panelId || !params.sourceId) {
    throw new Error('Missing required parameters: id, panelId, and sourceId');
  }

  // Обновление выбранного источника в БД для панели и зоны
  const zone = await zoneModel.findByIdAndUpdate(params.id, { activeSource: params.sourceId }, { new: true });
  const panel = await panelModel.findByIdAndUpdate(params.panelId, { activeSource: params.sourceId }, { new: true });

  // Запуск источника
  const source = await sourceModel.findById(params.sourceId);
  const driver = await driverModel.findById(source.driverId);
  driver.run(params.panelId);

  // Запуск метода источника runAction()
  const actions = source.runAction();
  for (const action of actions) {
    const driver = await driverModel.findById(action.driverId);
    driver.execute(action.command);
  }

  // Отправка подробного статуса зоны на все активные панели в этой зоне
  const io = getIo();
  const activePanels = await panelModel.find({ activeZone: params.id });
  activePanels.forEach(panel => {
    io.to(panel.socketId).emit('updateUI', { activeSource: source });
  });
  io.emit('updateUI', { activeZone: { name: zone.name, isActive: zone.isActive } });
}

module.exports = handleSourceSelect;
