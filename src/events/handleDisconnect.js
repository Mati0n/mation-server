const path = require('path'); 
const panelModel = require(path.join(__dirname, '..', 'models/Panel'));

async function handleDisconnect (io, panelId, data) {
  console.log(`Panel with UUID ${panelId} disconnected!`);
  const panel = await panelModel.findOne({ panelId });
  panel.socketId = null;
  await panel.save();
}

module.exports = handleDisconnect;
