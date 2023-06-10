const path = require('path');
const { EventEmitter } = require('events');
const events = new EventEmitter();

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
