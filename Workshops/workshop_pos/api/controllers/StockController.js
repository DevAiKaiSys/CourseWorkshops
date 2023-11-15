const express = require('express');
const app = express();
const { isLogin, getMemberId } = require('./Service');
const StockModel = require('../models/StockModel');

app.post('/stock/save', isLogin, async (req, res) => {
  try {
    let payload = { ...req.body, userId: getMemberId(req) };
    const result = await StockModel.create(payload);
    res.status(201).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
