const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

let clients = {};

function setup (app) {
  app.use('/auth', router);

  router.post('/register', (req, res) => {
    const { uuid } = req.body;
    if (clients[uuid]) {
      return res.status(400).json({ message: 'Panel already exists' });
    }
    clients[uuid] = {
      uuid,
      createdAt: new Date().toISOString(),
    };
    res.status(200).json({ message: 'Registration successful' });
  });

  router.post('/login', (req, res) => {
    const { uuid } = req.body;
    const client = clients[uuid];
    if (!client) {
      return res.status(400).json({ message: 'Invalid UUID' });
    }
    const token = jwt.sign({ uuid }, 'your-secret-key');
    res.status(200).json({ token });
  });
}

function authenticate (req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.uuid = decoded.uuid;
    next();
  });
}

module.exports = { setup, authenticate };
