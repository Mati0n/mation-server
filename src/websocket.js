import { server } from 'websocket';
import authModule from './auth';

function setup (app) {
  const wsServer = new server({
    httpServer: app,
  });

  wsServer.on('request', (request) => {
    const connection = request.accept(null, request.origin);

    // Получение идентификатора клиента (hwid iOS устройства)
    const clientId = request.headers['x-client-id'];

    // Обработка подключения клиента
    const clientInfo = authModule.getClientInfo(clientId);
    if (clientInfo) {
      // Аутентификация клиента
      // ...
    } else {
      // Неаутентифицированный клиент
      connection.close();
      return;
    }

    // Сохранение информации о клиенте
    authModule.storeClientInfo(clientId, session, zone);

    // Обработчики событий WebSocket
    connection.on('message', (message) => {
      // Обработка сообщения от WebSocket-клиента
      console.log('Received message:', message);
    });

    connection.on('close', () => {
      // Обработка закрытия соединения
      console.log('WebSocket connection closed');
      // Удаление информации о клиенте
      authModule.removeClientInfo(clientId);
    });
  });
}

export default { setup };
