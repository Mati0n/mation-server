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
const PanelModel = require(path.join(__dirname, '.', 'models/Panel'));
const ZoneModel = require(path.join(__dirname, '.', 'models/Zone'));
const SourceModel = require(path.join(__dirname, '.', 'models/Source'));
const DriverModel = require(path.join(__dirname, '.', 'models/Driver'));

const Loader = require('./core/loader');

const loader = new Loader();

async function initializeData () {
  // Создаем драйвер
  let driver = await DriverModel.findOne({ name: "Placeholder driver" });
  if (!driver) {
    driver = await DriverModel.create({
      name: "Placeholder driver",
      version: {
        major: 1,
        minor: 0,
        patch: 0,
        stage: "beta"
      },
      isCompatible: true
    });
  }

  // Создаем зоны
  for (let i = 1; i <= 5; i++) {
    let zone = await ZoneModel.findOne({ name: `Zone ${i}` });
    if (!zone) {
      zone = await ZoneModel.create({ name: `Zone ${i}`, isActive: false });
    }

    // Создаем источники для каждой зоны
    for (let j = 1; j <= 5; j++) {
      let source = await SourceModel.findOne({ name: `Source s${j}z${i}` });
      if (!source) {
        source = await SourceModel.create({
          name: `Source s${j}z${i}`,
          isActive: false,
          driver: driver._id
        });
        zone = await ZoneModel.findOneAndUpdate({ name: `Zone ${i}` }, { $addToSet: { sources: source._id } }, { new: true });
      }
    }
  }
}
// Подключение к MongoDB с использованием mongoose
loader.add({
  name: 'Connect to MongoDB...',
  run: () => {
    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb://localhost/mation', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => {
        console.log('Connected to MongoDB');

        // Инициализация всех панелей и состояние зон и источников в базе данных
        PanelModel.updateMany({}, { state: 'inactive', socketId: null });
        ZoneModel.updateMany({}, { active: false });
        SourceModel.updateMany({}, { active: false });

        initializeData();
      })
      .catch(err => console.error('Failed to connect to MongoDB', err));
  }
});

//
loader.add({
  name: 'Set up Auth module...',
  run: () => authModuleSetup(app)
});

// Use morgan for HTTP request logging
loader.add({
  name: 'Load HTTP request logging...',
  run: () => {
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
    app.use(express.json());
  }
});

//
// loader.add({
//   name: 'Import API modules and routes...',
//   run: () => {
//     // API modules imports
//     const zonesRouter = require('./api/v1/zones');
//     const sourcesRouter = require('./api/v1/sources');
//     const scenesRouter = require('./api/v1/scenes');
//     const configRouter = require('./api/v1/auth');
//     const statusRouter = require('./api/v1/status');
//     const driversRouter = require('./api/v1/drivers');
//     const authRouter = require('./api/v1/auth');

//     // API routes
//     app.use('/auth', authRouter);
//     app.use('/api/v1/sources', sourcesRouter);
//     app.use('/api/v1/scenes', scenesRouter);
//     app.use('/api/v1/config', configRouter);
//     app.use('/api/v1/status', statusRouter);
//     app.use('/api/v1/zones', zonesRouter);
//     app.use('/api/v1/drivers', driversRouter);
//   }
// });

// Загрузить все драйверы в папке "drivers" при старте сервера
loader.add({
  name: 'Load drivers...',
  run: () => drivers.loadAll()
});

//
loader.add({
  name: 'Websocket Server Setup...',
  run: () => {
    websocketSetup(app);
    coreModuleSetup();
  }
});

loader.run().catch(console.error);

function errorHandler (err, req, res, next) {
  console.error(err.message);
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(500).json({ message: 'Internal server error' });
}

app.use(errorHandler);