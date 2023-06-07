import { Router } from 'express';
const router = Router();

// Определение маршрутов API
router.get('/api/users', (req, res) => {
  // Обработка запроса
  res.send('API endpoint: /users');
});

function setup (app) {
  // Подключение API маршрутов к Express.js приложению
  app.use(router);
}

export default { setup };
