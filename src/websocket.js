const { server } = require('websocket');
const { authenticate, clients } = require('./auth');

function setup (app) {
  const wsServer = new server({
    httpServer: app,
  });

  wsServer.on('request', (request) => {
    const connection = request.accept(null, request.origin);
    const uuid = request.headers['x-client-id'];
    const client = clients[uuid];
    if (client) {
      // Authenticated client
      // ...
      client.connection = connection;
      client.session = { /* ... */ };
      // ...
      connection.on('message', (message) => {
        // Update client.state based on the message
        client.state = { /* ... */ };

        // когда вам нужно отправить обновления клиенту, вы можете просто использовать его соединение
        // const client = clients[uuid];
        // if (client && client.connection) {
        //   const update = { /* ... */ };
        //   client.connection.send(JSON.stringify(update));
        // }

        // если вам нужно отправить обновления всем клиентам:
        // const update = { /* ... */ };
        // for (const client of Object.values(clients)) {
        //   if (client.connection) {
        //     client.connection.send(JSON.stringify(update));
        //   }
        // }
      });

      connection.on('close', () => {
        // Remove the connection from the client
        delete client.connection;

      });
      //
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
