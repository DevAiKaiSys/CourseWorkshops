const express = require('express');
const app = express();
const PackageModel = require('../models/PackageModel');

app.get('/package/list', async (req, res) => {
  //   res.send('test');
  try {
    const results = await PackageModel.findAll({ order: ['price'] });
    res.send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
