import { Router } from 'express';
const router = Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Метод регистрации новых пользователей
router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, email, name, role } = req.body;

    // Проверка, что пользователь с таким именем не существует
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Создание нового пользователя

    const user = new User({
      username,
      password,
      email,
      name,
      role,
    });

    await user.save();

    // Отправка успешного ответа

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка пользовательских данных
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Обновление updatedAt

    user.updatedAt = new Date();
    await user.save();

    // Генерация и отправка токена аутентификации
    const token = jwt.sign({ username }, 'secret-key');
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Использование промежуточного ПО в защищенных маршрутах
router.get('/api/users', authenticateToken, (req, res) => {
  // Обработка запроса
  res.send('API endpoint: /users');
});

const connectedClients = new Map();

function storeClientInfo (clientId, session, zone) {
  connectedClients.set(clientId, { session, zone });
}

function removeClientInfo (clientId) {
  connectedClients.delete(clientId);
}

function getClientInfo (clientId) {
  return connectedClients.get(clientId);
}

module.exports = { setup, storeClientInfo, removeClientInfo, getClientInfo };