async function handleError (io, panelId, error) {
  console.log(`Error sending data to panel with UUID ${panelId}: ${error}`);
}

module.exports = handleError;
