const express = require('express');
const path = require('path');
const morgan = require('morgan');
const logger = require('./logger/logger');
const app = express();
const mongoose = require('mongoose');
const { setup: authModuleSetup } = require('./core/auth');
const { setup: websocketSetup } = require('./core/socketio');
const { setup: coreModuleSetup } = require('./core/core');
const drivers = require('./core/drivers');
const Panel = require(path.join(__dirname, '.', 'models/Panel'));
const Zone = require(path.join(__dirname, '.', 'models/Zone'));
const Source = require(path.join(__dirname, '.', 'models/Source'));

// Подключение к MongoDB с использованием mongoose
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/mation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Use morgan for HTTP request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());

authModuleSetup(app);

// API modules imports
const zonesRouter = require('./api/v1/zones');
const sourcesRouter = require('./api/v1/sources');
const scenesRouter = require('./api/v1/scenes');
const configRouter = require('./api/v1/config');
const statusRouter = require('./api/v1/status');
const driversRouter = require('./api/v1/drivers');

// API routes
app.use('/api/v1/sources', sourcesRouter);
app.use('/api/v1/scenes', scenesRouter);
app.use('/api/v1/config', configRouter);
app.use('/api/v1/status', statusRouter);
app.use('/api/v1/zones', zonesRouter);
app.use('/api/v1/drivers', driversRouter);

// Загрузить все драйверы в папке "drivers" при старте сервера
drivers.loadAll();

// Инициализация всех панелей и состояние зон и источников в базе данных
Panel.updateMany({}, { state: 'inactive', socketId: null });
Zone.updateMany({}, { active: false });
Source.updateMany({}, { active: false });

websocketSetup(app);
coreModuleSetup();

function errorHandler (err, req, res, next) {
  console.error(err.message);
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(500).json({ message: 'Internal server error' });
}

app.use(errorHandler);