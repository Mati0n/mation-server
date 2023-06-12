const { io } = require('./socketio.js');
const { serializeZones } = require('./serialize');
const path = require('path');
const zoneModel = require(path.join(__dirname, '..', 'models/Zone'));
const panelModel = require(path.join(__dirname, '..', 'models/Panel'));

async function handleZones (panelId) {
  console.log(`Request Zones from panel ${panelId}`);
  const zones = await zoneModel.find().map(zone => serializeZones(zone));
  io.to(panel.socketId).emit('getZones', { zones });
}

module.exports = handleZones;
