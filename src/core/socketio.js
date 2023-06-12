const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const handleZoneSelect = require('../events/handleZoneSelect');
//const { authenticate } = require('./auth');
//const { events } = require('./core');
const handleZones = require(path.join(__dirname, '..', 'events/handleZones'));
const handleZoneSelect = require(path.join(__dirname, '..', 'events/handleZoneSelect'));
const handleSources = require(path.join(__dirname, '..', 'events/handleSources'));
const handleSourceSelect = require(path.join(__dirname, '..', 'events/handleSourceSelect'));
const panelModel = require(path.join(__dirname, '..', 'models/Panel'));
const zoneModel = require(path.join(__dirname, '..', 'models/Zone'));
const SourceModel = require(path.join(__dirname, '..', 'models/Source'));

let io;

async function setup (app) {
  const server = http.createServer(app);
  const io = new Server(server);
  const port = 53301;

  io.use(async (socket, next) => {
    const uuid = socket.handshake.query.uuid;
    
    if (!uuid) {
      console.log('No UUID provided');
      socket.disconnect(true);
      return;
    }
    
    let panel = await panelModel.findOne({ uuid });
    if (!panel) {
      // No panel found with this UUID, create a new one
      panel = new panelModel({ uuid, socketId: socket.id, state: 'inactive' });
      await panel.save();
      console.log(`Registered new panel with UUID ${uuid}`);
    } else {
      // Existing panel found, update the socket ID
      panel.socketId = socket.id;
      await panel.save();
    }
    // If the panel is not registered for some reason, disconnect the socket
    if (!panel) {
      console.log(`Failed to register panel with UUID ${uuid}`);
      socket.disconnect(true);
      return;
    }
    return next();
  });

  io.on('connection', async (socket) => {
    const uuid = socket.handshake.query.uuid;
    console.log(`Panel ${uuid} connected to the Server!`);

    socket.emit('registration', { status: 'success', message: 'Panel connected successfully' });

    socket.on('getZones', async () => { handleZones(uuid) });

    socket.on('selectZone', async (payload) => {
      if(!payload.id) {
        console.log(`Error: zone id not provided!`);
        return;
      }
      console.log(`Select Zone from panel ${uuid}: ${JSON.stringify(payload)}`);
      handleZoneSelect(uuid, payload.id);
    });

    socket.on('getSources', async () => { handleSources(uuid) });

    socket.on('selectSource', async (payload) => {
      if (!payload.id) {
        console.log(`Error: source id not provided!`);
        return;
      }
      console.log(`Select Source from panel ${uuid}: ${JSON.stringify(payload)}`);
      handleSourceSelect(uuid, payload.id);
    });

    socket.on('disconnect', async () => {
      console.log(`Panel with UUID ${uuid} disconnected`);
      const panel = await panelModel.findOne({ uuid });
      panel.socketId = null;
      await panel.save();
    });

    socket.on('error', (error) => {
      console.log(`Error sending data to panel with UUID ${uuid}: ${error}`);
    });
  });

  server.listen(port, () => {
    console.log(`MATION Server is running on port ${port}`);
  });

  return io;
}

module.exports = { setup, io };