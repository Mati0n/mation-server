const express = require('express');
const app = express();
const port = 53305;
const databaseModule = require('./database');
const apiModule = require('./api');
const { setup: websocketSetup } = require('./websocket');
const authModule = require('./auth');
const { setup: coreSetup } = require('./core');

app.use(express.json());

authModule.setup(app);
apiModule.setup(app);
websocketSetup(app);
coreSetup();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
