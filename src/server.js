import express from 'express';
const app = express();
const port = 53304;

// Подключение модулей
import databaseModule from './database';
import apiModule from './api';
import { setup } from './websocket';
import authModule from './auth';
import { setup as _setup } from './core';

// Подключение базы данных
databaseModule.connect();

// Подключение API
apiModule.setup(app);

// Подключение WebSocket
setup(app);

// Подключение модуля аутентификации
authModule.setup(app);

// Подключение ядра сервера
_setup();

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
