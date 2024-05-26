const { serializeZones } = require('./serialize');
const path = require('path');
const zoneModel = require(path.join(__dirname, '..', 'models/Zone'));
const panelModel = require(path.join(__dirname, '..', 'models/Panel'));

async function handleZones (io, panelId, data) {
  console.log(`Request Zones from panel ${panelId}`);
  const zones = await zoneModel.find().then(zones => zones.map(zone => serializeZones(zone)));
  const panel = await panelModel.findOne({ panelId });

  console.log(`Send Zones to the socket ${panel.socketId}: ${JSON.stringify(zones)}`);
  io.to(panel.socketId).emit('getZones', { zones });
}

module.exports = handleZones;
