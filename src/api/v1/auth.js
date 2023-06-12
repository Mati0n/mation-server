const express = require('express');
const router = express.Router(); 
//const path = require('path');
//const Panel = require(path.join(__dirname, '../..', 'models/Panel'));

router.put('/register', async (req, res) => {
  // Handle the registration
  // For example:
  // const { uuid } = req.body;
  // const panel = new Panel({ uuid });
  // await panel.save();
  // res.json({ panel });
});

router.put('/login', async (req, res) => {
  // Handle the login
  // For example:
  // const { uuid } = req.body;
  // const panel = await Panel.findOne({ uuid });
  // if (!panel) {
  //   return res.status(401).json({ error: 'No client found with this UUID' });
  // }
  // res.json({ panel });
});


module.exports = router;