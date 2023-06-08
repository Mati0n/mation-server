const express = require('express');
const app = express();
const port = 53305;

// Подключение модулей
const databaseModule = require('./database');
const apiModule = require('./api');
const { setup } = require('./websocket');
const authModule = require('./auth');
const { setup: coreSetup } = require('./core');

// Подключение базы данных
//databaseModule.connect();

// Подключение API
apiModule.setup(app);

// Подключение WebSocket
setup(app);

// Подключение модуля аутентификации
authModule.setup(app);

// Подключение ядра сервера
coreSetup();

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
