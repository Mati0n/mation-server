const { serializeZoneSelect, serializeSource } = require('./serialize');
const path = require('path');
const zoneModel = require(path.join(__dirname, '..', 'models/Zone'));
const panelModel = require(path.join(__dirname, '..', 'models/Panel'));

async function handleSources (io, panelId, data) {
  console.log(`Request Zones from panel ${panelId}`);
  const panel = await panelModel.findOne({ panelId });
  const zoneId = panel.activeZoneId;
  const serializedSources = await zoneModel.findById(zoneId).map(zone => serializeZoneSelect(zone)).map(source => serializeSource(source));

  io.to(panel.socketId).emit('getSources', { serializedSources });
}

module.exports = handleSources;
