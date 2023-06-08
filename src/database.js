const fs = require('fs');
const path = require('path');
const User = require('./models/user');
const express = require('express');
const router = express.Router();

const DATA_FILE_PATH = path.join(__dirname, 'data', 'users.json');

let usersData = {};

// Загрузка данных из файла при запуске сервера
function loadUserData () {
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');

    // Проверка, что файл не пустой
    if (!data) {
      return;
    }

    usersData = JSON.parse(data);
  } catch (error) {
    // Обработка ошибки разбора JSON или других ошибок
    console.error('Error loading user data:', error);
    usersData = {}; // Установка пустого объекта, если данные не удалось загрузить
  }
}

// Сохранение данных в файл
function saveUserData () {
  try {
    const data = JSON.stringify(usersData, null, 2);
    fs.writeFileSync(DATA_FILE_PATH, data, 'utf8');
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// Загрузка данных из файла
loadUserData();

// ...

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, email, name, role } = req.body;

    // Проверка, что пользователь с таким именем не существует
    const existingUser = usersData[username];
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, password, email, name, role });

    // Запомните время создания пользователя только при его первом создании
    if (!user.createdAt) {
      user.createdAt = new Date().toISOString();
    }

    // Сохранение пользователя в объекте
    usersData[username] = user;

    // Сохранение данных в файл
    saveUserData();

    console.log('User created:', user);

    // Отправка успешного ответа
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// ...
