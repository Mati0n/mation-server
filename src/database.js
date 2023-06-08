const fs = require('fs');
const path = require('path');
const DATA_FILE_PATH = path.join(__dirname, 'data', 'panels.json');
let panelsData = {};

function loadPanelData () {
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    if (!data) {
      return;
    }
    panelsData = JSON.parse(data);
  } catch (error) {
    console.error('Error loading panel data:', error);
    panelsData = {};
  }
}

function savePanelData () {
  try {
    const data = JSON.stringify(panelsData, null, 2);
    fs.writeFileSync(DATA_FILE_PATH, data, 'utf8');
    console.log('Panel data saved successfully');
  } catch (error) {
    console.error('Error saving panel data:', error);
  }
}

loadPanelData();

module.exports = { panelsData, savePanelData };
