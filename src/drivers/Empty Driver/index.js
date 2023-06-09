const DriverSDK = require("../../sdk/DriverSDK");

const driver = new DriverSDK("YourDriverName");

driver.init();

driver.setPowerOn = () => {
  // ваша логика включения устройства
};

driver.setPowerOff = () => {
  // ваша логика выключения устройства
};

driver.setInput = (param) => {
  // ваша логика установки источника
};


module.exports = driver;