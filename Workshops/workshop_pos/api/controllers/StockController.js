const express = require('express');
const app = express();
const { isLogin, getMemberId } = require('./Service');
const StockModel = require('../models/StockModel');
const ProductModel = require('../models/ProductModel');

app.post('/stock/save', isLogin, async (req, res) => {
  try {
    let payload = { ...req.body, userId: getMemberId(req) };
    const result = await StockModel.create(payload);
    res.status(201).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/stock/list', isLogin, async (req, res) => {
  try {
    StockModel.belongsTo(ProductModel);

    const results = await StockModel.findAll({
      where: { userId: getMemberId(req) },
      order: [['id', 'DESC']],
      include: {
        model: ProductModel,
      },
    });
    res.status(200).send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
