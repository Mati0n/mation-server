const express = require('express');
const router = express.Router();
const { authenticate } = require('./auth');
const { events, handleAction } = require('./core');
const logger = require('../logger/logger');
const { validateZoneId, validateAction } = require('./validation');

events.on('action', (action) => {
  // Handle the action event
  // For example, you can send updates to the client
});

function setup (app) {
  app.use('/api', router);

  //router.use(authenticate);

  router.get('/status', (req, res) => {
    // Handle status request
    res.json({ message: 'OK' });
  });

  router.post('/command', (req, res) => {
    // Handle command request
    res.json({ message: 'Command received' });
  });

  router.get('/config', (req, res) => {
    // Get the configuration data
    logger.info('Received a request for config');
    const config = { /* ... */ };
    res.json(config);
  });
}

module.exports = { setup };
