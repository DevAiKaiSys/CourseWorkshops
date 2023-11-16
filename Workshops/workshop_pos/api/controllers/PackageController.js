const express = require('express');
const app = express();
const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');

app.get('/package/list', async (req, res) => {
  //   res.send('test');
  try {
    const results = await PackageModel.findAll({ order: ['price'] });
    res.status(200).send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/package/memberRegister', async (req, res) => {
  try {
    const result = await MemberModel.create(req.body);
    res.send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
