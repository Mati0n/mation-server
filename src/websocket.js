import { server } from 'websocket';

function setup (app) {
  const wsServer = new server({
    httpServer: app,
  });

  wsServer.on('request', (request) => {
    const connection = request.accept(null, request.origin);

    // Обработчики событий WebSocket
    connection.on('message', (message) => {
      // Обработка сообщения от WebSocket-клиента
      console.log('Received message:', message);
    });

    connection.on('close', () => {
      // Обработка закрытия соединения
      console.log('WebSocket connection closed');
    });
  });
}

export default { setup };
