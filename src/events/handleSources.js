const { serializeZoneSelect, serializeSource } = require('./serialize');
const { io } = require('./socketio.js');
const zoneModel = require('../models/zone');
const panelModel = require('../models/panel');

async function handleSources (panelId) {
  console.log(`Request Zones from panel ${panelId}`);
  const panel = await panelModel.findById(panelId);
  const zoneId = panel.activeZoneId;
  const serializedSources = await zoneModel.findById(zoneId).map(zone => serializeZoneSelect(zone)).map(source => serializeSource(source));

  io.to(panel.socketId).emit('getSources', { serializedSources });
}

module.exports = handleSources;
