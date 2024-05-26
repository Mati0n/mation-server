const { serializeZones, serializeZoneSelect, serializeSource } = require('./serialize');
const path = require('path');
const mongoose = require('mongoose');
const zoneModel = require(path.join(__dirname, '..', 'models/Zone'));
const panelModel = require(path.join(__dirname, '..', 'models/Panel'));

async function handleZoneSelect (io, panelId, data) {
  const zoneId = data.zoneId;
  //Проверить входные параметры тут или выше в сокете перед отправкой в хендлер
  const updatedZone = await zoneModel.findOneAndUpdate({ zoneId }, { $addToSet: { controlledBy: panelId } }, { new: true });
  const zone = serializeZoneSelect(updatedZone);
  //zone.sources.map(source => serializeSource(source));
  const updatedPanel = await panelModel.findOneAndUpdate({ panelId }, { activeZoneId: zoneId }, { new: true });

  console.log(`selectZone: ${JSON.stringify(zone)}`);
  io.to(updatedPanel.socketId).emit('selectZone', { zoneSelect: zone })
}

module.exports = handleZoneSelect;
