const express = require('express');
const router = express.Router();
const path = require('path');
const DriverModel = require(path.join(__dirname, '../..', 'models/Driver'));

// Получение списка доступных драйверов
router.get('/', async (req, res) => {
  // Запросить список драйверов из базы данных
  const availableDrivers = await DriverModel.find({});
  res.json(availableDrivers);
});

// Присвоение драйвера источнику
router.post('/:driverId/assign/:sourceId', async (req, res) => {
  const { driverId, sourceId } = req.params;

  // Присвоение драйвера источнику в базе данных и сохранение
  // ...

  res.json({ message: `Driver '${driverId}' assigned to source '${sourceId}'` });
});

module.exports = router;