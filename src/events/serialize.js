// serialize.js

function serializeZones (zone) {
  return {
    id: zone._id,
    name: zone.name,
    //sources: zone.devices,
    isActive: zone.isActive,
    volumeBar: zone.volumeBar,
  };
}

function serializeZoneSelect (zone) {
  return {
    id: zone._id,
    name: zone.name,
    sources: zone.devices,
    isActive: zone.isActive,
    volumeBar: zone.volumeBar,
  };
}

function serializeSource (source) {
  return {
    id: source._id,
    name: source.name,
    isActive: source.isActive,
    isVisible: source.isVisible,
  };
}

module.exports = { serializeZones, serializeZoneSelect, serializeSource };

/**
const { serializeZone, serializeSource } = require('./serialize');
const zoneModel = require('./models/Zone');
const sourceModel = require('./models/Source');

async function sendZoneData(panelSocket) {
  const zones = await zoneModel.find();
  const serializedZones = zones.map(zone => serializeZone(zone));
  panelSocket.emit('zoneData', serializedZones);
}

async function sendSourceData(panelSocket) {
  const sources = await sourceModel.find();
  const serializedSources = sources.map(source => serializeSource(source));
  panelSocket.emit('sourceData', serializedSources);
}

// Использование функций для отправки данных на панель
const panelSocket = // получение сокета панели
sendZoneData(panelSocket);
sendSourceData(panelSocket);

 */