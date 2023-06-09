const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const { authenticate } = require('./auth');
const { events } = require('./core');
const Panel = require(path.join(__dirname, '..', 'models/Panel'));

events.on('action', (action) => {
  // Handle the action event
  // For example, you can send updates to the client
});

async function setup (app) {
  // ...
  const server = http.createServer(app);
  const io = new Server(server);
  const port = 53301;

  io.use(async (socket, next) => {
    const uuid = socket.handshake.query.uuid;
    const panel = await Panel.findOne({ uuid });
    if (panel) {
      // Authenticated Client
      panel.socketId = socket.id;
      await panel.save();
      return next();
    }
    // Unauthenticated Client
    console.log(`Unauthenticated websocket connection attempt from ${socket.conn.remoteAddress}`);
    next(new Error(`Authentication error - Unauthenticated websocket connection attempt from ${socket.conn.remoteAddress}`));
  });
  io.on('connection', async (socket) => {
    console.log('Someone connected');
    socket.on('message', async (message) => {
      console.log('Message: ' + message);
      // Update client.state based on the message
      const uuid = socket.handshake.query.uuid;
      const panel = await Panel.findOne({ uuid });
      panel.state = { /* ... */ };
      await panel.save();
    });
    socket.on('disconnect', async () => {
      console.log('Connection closed');
      // Remove the socket from the client
      const uuid = socket.handshake.query.uuid;
      const panel = await Panel.findOne({ uuid });
      panel.socketId = null;
      await panel.save();
    });
  });

  server.listen(port, () => {
    console.log(`MATION Server is running on port ${port}`);
  });

  return io;
}

module.exports = { setup };
