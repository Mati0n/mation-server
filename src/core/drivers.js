const fs = require('fs');
const path = require('path');
const DriverModel = require(path.join(__dirname, '..', 'models/Driver'));
const driversPath = path.join(__dirname, '..', 'drivers/');

function loadAll () {
  const driverFolders = fs.readdirSync(driversPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  driverFolders.forEach(driverFolder => {
    const driver = loadDriver(driverFolder);
    if (driver) {
      const driverData = {
        name: driverFolder,
        version: driver.version
      };
      DriverModel.create(driverData, (err, createdDriver) => {
        if (err) {
          console.error(`Failed to save driver '${driverFolder}' to the database:`, err.message);
        } else {
          console.log(`Driver '${driverFolder}' saved to the database`);
        }
      });
    }
  });
}

function loadDriver (driverName) {
  try {
    const driver = require(`${driversPath}${driverName}`);
    return driver;
  } catch (error) {
    console.error(`Failed to load driver '${driverName}':`, error.message);
    return null;
  }
}

async function executeCommand (driver, command, params) {
  try {
    const result = await driver.command(command, params);
    return result;
  } catch (error) {
    console.error(`Failed to execute command '${command}' on driver:`, error.message);
    return null;
  }
}

async function getDriverFeedback (driver) {
  try {
    const feedback = await driver.getFeedback();
    return feedback;
  } catch (error) {
    console.error(`Failed to get feedback from driver:`, error.message);
    return null;
  }
}

module.exports = {
  loadAll,
  loadDriver,
  executeCommand,
  getDriverFeedback,
};