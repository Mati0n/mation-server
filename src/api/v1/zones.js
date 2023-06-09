const express = require('express');
const router = express.Router();
const path = require('path');
const zoneModel = require(path.join(__dirname, '../..', 'models/Zone'));

// Получение списка всех зон
router.get('/', async (req, res) => {
  const zones = await zoneModel.find();
  res.json({ zones });
});

// Получение информации о зоне по id
router.get('/:id', async (req, res) => {
  const zone = await zoneModel.findById(req.params.id);
  res.json({ zone });
});

// Создание новой зоны
router.post('/', async (req, res) => {
  const zone = new zoneModel(req.body);
  await zone.save();
  res.status(201).json({ zone });
});

// Изменение существующей зоны
router.put('/:id', async (req, res) => {
  const zone = await zoneModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ zone });
});

// Удаление зоны
router.delete('/:id', async (req, res) => {
  await zoneModel.findByIdAndRemove(req.params.id);
  res.status(204).json({ message: 'Zone deleted successfully' });
});

// Выбор активной зоны для управления
router.put('/:id/select', async (req, res) => {
  const zone = await zoneModel.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
  res.json({ zone });
});

// Выключение зоны (отключение управления)
router.put('/:id/disable', async (req, res) => {
  const zone = await zoneModel.findByIdAndUpdate(req.params.id, { isEnabled: req.body.isEnabled }, { new: true });
  res.json({ zone });
});

// Получение статуса зоны (включена или выключена)
router.get('/:id/status', async (req, res) => {
  const zone = await zoneModel.findById(req.params.id, 'isActive isEnabled');
  res.json({ status: zone });
});

// Изменение настроек зоны
router.put('/:id/settings', async (req, res) => {
  const zone = await zoneModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ zone });
});

module.exports = router;