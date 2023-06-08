const { server } = require('websocket');
const { authenticate } = require('./auth');

function setup (app) {
  const wsServer = new server({
    httpServer: app,
  });

  wsServer.on('request', (request) => {
    const connection = request.accept(null, request.origin);
    const uuid = request.headers['x-client-id'];
    const clientInfo = authenticate(uuid);
    if (clientInfo) {
      // Authenticated client
      // ...
    } else {
      // Unauthenticated client
      connection.close();
      return;
    }

    connection.on('message', (message) => {
      // Handle message from WebSocket client
      console.log('Received message:', message);
    });

    connection.on('close', () => {
      // Handle connection close
      console.log('WebSocket connection closed');
    });
  });
}

module.exports = { setup };
