function validateZoneId (req, res, next) {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid zone ID' });
  }
  next();
}

function validateAction (req, res, next) {
  const { action } = req.body;
  if (!action || typeof action !== 'object') {
    return res.status(400).json({ message: 'Invalid action data' });
  }
  // Здесь можно добавить валидацию специфических полей для действий, если необходимо
  next();
}

module.exports = { validateZoneId, validateAction };