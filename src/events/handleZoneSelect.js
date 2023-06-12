const { serializeZoneSelect, serializeSource } = require('./serialize');
const path = require('path');
const { io } = require('./socketio.js');
const zoneModel = require(path.join(__dirname, '..', 'models/Zone'));
const panelModel = require(path.join(__dirname, '..', 'models/Panel'));

async function handleZoneSelect (panelId, zoneId) {
  //Проверить входные параметры тут или выше в сокете перед отправкой в хендлер
  const updatedZone = await zoneModel.findByIdAndUpdate(zoneId, { $addToSet: { controlledBy: panelId } }, { new: true });
  const updatedPanel = await panelModel.findByIdAndUpdate(panelId, { activeZoneId: zoneId }, { new: true });
  updatedZone.sources.map(source => serializeSource(source));

  io.to(updatedPanel.socketId).emit('selectZone', { updatedZone })
}

module.exports = handleZoneSelect;
