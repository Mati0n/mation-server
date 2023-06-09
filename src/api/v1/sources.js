const express = require('express');
const router = express.Router();
const path = require('path');
const SourceModel = require(path.join(__dirname, '../..', 'models/Source'));

// Получение списка всех источников
router.get('/', async (req, res) => {
  const sources = await SourceModel.find();
  res.json({ sources });
});

// Получение информации об источнике по id
router.get('/:id', async (req, res) => {
  const source = await SourceModel.findById(req.params.id);
  res.json({ source });
});

// Создание нового источника
router.post('/', async (req, res) => {
  const source = new SourceModel(req.body);
  await source.save();
  res.status(201).json({ source });
});

// Изменение существующего источника
router.put('/:id', async (req, res) => {
  const source = await SourceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ source });
});

// Удаление источника
router.delete('/:id', async (req, res) => {
  await SourceModel.findByIdAndRemove(req.params.id);
  res.status(204).json({ message: 'Source deleted successfully' });
});

// Событие при выборе источника в зоне
router.post('/zones/:zoneId/sources/:sourceId/select', async (req, res) => {
  // Тут должно быть логика для обработки события выбора источника
});

// Управление питанием источника
router.put('/:id/power', async (req, res) => {
  // Тут должно быть логика для управления питанием источника
});

// Управление громкостью источника
router.put('/:id/volume', async (req, res) => {
  // Тут должно быть логика для управления громкостью источника
});

// Управление предустановленными функциями (действиями)
router.put('/:id/actions/:actionId', async (req, res) => {
  // Тут должно быть логика для управления предустановленными функциями источника
});

// Получение информации об обратной связи от источника
router.get('/:id/feedback', async (req, res) => {
  // Тут должно быть логика для получения информации об обратной связи от источника
});

// Получение дополнительных функций управления
router.get('/:id/functions', async (req, res) => {
  // Тут должно быть логика для получения дополнительных функций управления источника
});

// Присвоение драйвера источнику
router.put('/:driverId/assign/:sourceId', async (req, res) => {
  const { driverId, sourceId } = req.params;

  try {
    const source = await SourceModel.findByIdAndUpdate(sourceId, { driver: driverId }, { new: true });

    res.json({
      message: `Driver '${driverId}' assigned to source '${sourceId}'`,
      source
    });
  } catch (error) {
    console.error(`Failed to assign driver '${driverId}' to source '${sourceId}':`, error.message);
    res.status(500).json({ message: "An error occurred when assigning the driver to the source." });
  }
});

module.exports = router;