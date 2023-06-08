const express = require('express');
const router = express.Router();
const { authenticate } = require('./auth');

function setup (app) {
  app.use('/api', router);

  router.use(authenticate);

  router.get('/status', (req, res) => {
    // Handle status request
    res.json({ message: 'OK' });
  });

  router.post('/command', (req, res) => {
    // Handle command request
    res.json({ message: 'Command received' });
  });
}

module.exports = { setup };
