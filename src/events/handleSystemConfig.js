const { serializeZones, serializeSource } = require('./serialize');
const path = require('path');
const zoneModel = require(path.join(__dirname, '..', 'models/Zone'));
const sourceModel = require(path.join(__dirname, '..', 'models/Source'));
const panelModel = require(path.join(__dirname, '..', 'models/Panel'));

async function handleSystemConfig (io, panelId, data) {
  console.log(`Request System Config from panel ${panelId}`);
  const zones = await zoneModel.find().then(zones => zones.map(zone => serializeZones(zone)));
  const sources = await sourceModel.find().then(sources => sources.map(source => serializeSource(source)));
  
  const panel = await panelModel.findOne({ panelId });
  io.to(panel.socketId).emit('getSystemConfig', { zones, sources });
}

module.exports = handleSystemConfig;