class DriverSDK {
  constructor(driverName) {
    this.driverName = driverName;
    this.eventListeners = [];
  }

  // System methods
  init () {
    //
  }

  addActionListener (listener) {
    this.eventListeners.push(listener);
  }

  // API methods
  setPowerOn () { }

  setPowerOff () { }

  setInput (param) { }

  action (id, payload) { }

  runAction (payload) {
    //
  }
}

module.exports = DriverSDK;