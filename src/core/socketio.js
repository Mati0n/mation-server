const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const handleSystemConfig = require(path.join(__dirname, '..', 'events/handleSystemConfig'));
const handleZones = require(path.join(__dirname, '..', 'events/handleZones'));
const handleZoneSelect = require(path.join(__dirname, '..', 'events/handleZoneSelect'));
const handleSources = require(path.join(__dirname, '..', 'events/handleSources'));
const handleSourceSelect = require(path.join(__dirname, '..', 'events/handleSourceSelect'));
const handleDisconnect = require(path.join(__dirname, '..', 'events/handleDisconnect'));
//const handlError = require(path.join(__dirname, '..', 'events/handlError'));

const panelModel = require(path.join(__dirname, '..', 'models/Panel'));
//const zoneModel = require(path.join(__dirname, '..', 'models/Zone'));
//const SourceModel = require(path.join(__dirname, '..', 'models/Source'));

let io;

async function setup (app) {
  const server = http.createServer(app);
  const io = new Server(server);
  const port = 53301;

  io.use(async (socket, next) => {
    const panelId = socket.handshake.query.uuid;

    if (!panelId) {
      console.log('No UUID provided');
      socket.disconnect(true);
      return;
    }

    let panel = await panelModel.findOne({ panelId });
    if (!panel) {
      // No panel found with this UUID, create a new one
      panel = await panelModel.create({ panelId });
      //await panel.save();
      console.log(`Registered new panel with UUID ${panelId}`);
    }

    panel.socketId = socket.id;
    await panel.save();

    // If the panel is not registered for some reason, disconnect the socket
    if (!panel) {
      console.log(`Failed to register panel with UUID ${panelId}`);
      socket.disconnect(true);
      return;
    }

    return next();
  });

  io.on('connection', async (socket) => {
    const panelId = socket.handshake.query.uuid;
    console.log(`Panel ${panelId} connected to the Server!`);

    const events = {
      'getSystemConfig': handleSystemConfig,
      'getZones': handleZones,
      'selectZone': handleZoneSelect,
      'getSources': handleSources,
      'selectSource': handleSourceSelect,
      'disconnect': handleDisconnect,
      //'error': handlError,
    };

    socket.emit('registration', { status: 'success', message: 'Panel connected successfully' });

    Object.keys(events).forEach(event => {
      socket.on(event, (data) => {
        console.log(`Received ${event} with data:`, data);
        events[event](io, panelId, data);
      });
    });

    socket.on('error', (error) => {
      console.log(`Error sending data to panel with UUID ${panelId}: ${error}`);
    });
  });

  server.listen(port, () => {
    console.log(`MATION Server is running on port ${port}`);
  });

  return io;
}

module.exports = { setup };