const jwt = require('jsonwebtoken');
const path = require('path');
const express = require('express');
const router = express.Router();
const logger = require('../logger/logger');
const { events } = require('./core');
const Panel = require(path.join(__dirname, '..', 'models/Panel'));

function setup (app) {
  app.use('/auth', router);
  router.post('/register', async (req, res) => {
    const { uuid } = req.query;
    logger.info(`uuid: ${uuid}`);
    const existingPanel = await Panel.findOne({ uuid });
    if (existingPanel) {
      return res.status(400).json({ message: 'Panel already exists' });
    }
    const newPanel = new Panel({ uuid });
    await newPanel.save();
    res.status(200).json({ message: 'Registration successful' });
  });
  router.post('/login', async (req, res) => {
    const { uuid } = req.query;
    const panel = await Panel.findOne({ uuid });
    if (!panel) {
      return res.status(400).json({ message: 'Invalid UUID' });
    }
    const token = jwt.sign({ uuid }, 'your-secret-key');
    res.status(200).json({ token });
  });
}

function authenticate (req, res, next) {
  const { uuid } = req.query;
  if (!uuid) {
    return res.status(400).json({ message: 'No UUID provided' });
  }
  req.uuid = uuid;
  next();
}

module.exports = { setup, authenticate };
