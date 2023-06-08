const { Server } = require('socket.io');
const http = require('http');
const { authenticate, clients } = require('./auth');
const { events } = require('./core');

events.on('action', (action) => {
  // Handle the action event
  // For example, you can send updates to the client
});

function setup (app) {

  // ...
  const server = http.createServer(app);
  const io = new Server(server);

  io.use((socket, next) => {
    const uuid = socket.handshake.query.uuid;
    if (clients[uuid]) {
      // Authenticated Client
      clients[uuid].socket = socket;
      return next();
    }

    // Unauthenticated Client
    console.log(`Unauthenticated websocket connection attempt from ${socket.conn.remoteAddress}`);
    next(new Error(`Authentication error - Unauthenticated websocket connection attempt from ${socket.conn.remoteAddress}`));
  });

  io.on('connection', (socket) => {
    console.log('Someone connected');

    socket.on('message', (message) => {
      console.log('Message: ' + message);

      // Update client.state based on the message
      const uuid = socket.handshake.query.uuid;
      clients[uuid].state = { /* ... */ };
    });

    socket.on('disconnect', () => {
      console.log('Connection closed');

      // Remove the socket from the client
      const uuid = socket.handshake.query.uuid;
      clients[uuid].socket = null;
    });
  });

  return server;
}

module.exports = { setup };