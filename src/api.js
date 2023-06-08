const express = require('express');
const router = express.Router();
const { authenticate } = require('./core/auth');
const { events, handleAction } = require('./core/core');
const logger = require('./logger/logger');
const { validateZoneId, validateAction } = require('./core/validation');

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

  router.get('/zones/:id', validateZoneId, (req, res) => {
    const { id } = req.params;
    // Get the zone data
    const zone = { /* ... */ };
    res.json(zone);
  });

  router.post('/zones/:id/actions', validateZoneId, validateAction, (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
    // Perform the action
    // ...
    res.json({ message: 'Action performed' });
  });

  router.post('/action', validateAction, (req, res) => {
    const { action } = req.body;
    events.emit('action', action);
    res.json({ message: 'Action received' });
  });
}

module.exports = { setup };
