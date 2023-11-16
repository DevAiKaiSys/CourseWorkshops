const express = require('express');
const app = express();
const BankModel = require('../models/BankModel');

app,
  get('/bank/list', async (req, res) => {
    try {
      const results = await BankModel.findAll();
      res.status(200).send({ results: results });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

module.exports = app;
