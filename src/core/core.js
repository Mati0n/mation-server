const { EventEmitter } = require('events');
const events = new EventEmitter();
const PanelController = require('../models/PanelController');

const panelControllers = {};

events.on('registerPanelController', (uuid) => {
  panelControllers[uuid] = new PanelController(uuid);;
});

events.on('updatePanelControllerLastSeen', (uuid) => {
  const panelController = panelControllers[uuid];
  if (panelController) {
    panelController.updateLastSeen();
  }
});

function setup () {
  // Инициализация ядра сервера и логики системы
  console.log('Core module is set up');
}

function handleAction (action) {
  // Handle the action...
  // Then emit an event
  events.emit('action', action);
}

module.exports = { setup, events, handleAction };
