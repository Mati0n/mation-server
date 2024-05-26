const { serializeZone, serializeSource } = require('./serialize');
const path = require('path');
const zoneModel = require(path.join(__dirname, '..', 'models/Zone'));
const panelModel = require(path.join(__dirname, '..', 'models/Panel'));
const sourceModel = require(path.join(__dirname, '..', 'models/Source'));
const driverModel = require(path.join(__dirname, '..', 'models/Driver'));

async function handleSourceSelect (io, panelId, data) {
  // Валидация входных параметров
  const sourceId = data.sourceId;
  // Обновление выбранного источника в БД для панели и зоны
  const zone = await zoneModel.findByIdAndUpdate(params.id, { activeSource: sourceId }, { new: true });
  zone.sources.map(source => source.isActive = source.id === sourceId);
  await zone.save();

  const panel = await panelModel.findByIdAndUpdate(params.panelId, { activeSourceId: sourceId }, { new: true });

  // Запуск источника
  const source = await sourceModel.findById(sourceId);
  const driver = await driverModel.findById(source.driverId);
  driver.run(params.panelId);

  // Запуск метода источника runAction()
  //TODO продумать SDK чтоб не проверять наличие методов  Они должны быть, но могут быть не объявлены
  const actions = source.runAction();
  for (const action of actions) {
    const driver = await driverModel.findById(action.driverId);
    driver.execute(action.command);
  }

  // Отправка подробного статуса зоны на все активные панели в этой зоне
  const activePanels = await panelModel.find({ activeZoneId: zoneId });
  const updatedZone = serializeZone(zone);
  activePanels.forEach(panel => {
    io.to(panel.socketId).emit('updateUI', { updatedZone });
  });
  io.emit('updateUI', { });
}

module.exports = handleSourceSelect;
