const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const BillSaleModel = require('../models/BillSaleModel');
const BillSaleDetailModel = require('../models/BillSaleDetailModel');
const { getMemberId, isLogin } = require('./Service');

require('dotenv').config();

app.get('/billSale/openBill', isLogin, async (req, res) => {
  try {
    const payload = {
      userId: getMemberId(req),
      status: 'open',
    };
    const result = await BillSaleModel.findOrCreate({
      where: payload,
    });
    res.status(200).send({ result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/billSale/sale', async (req, res) => {
  try {
    const payload = {
      userId: getMemberId(req),
      status: 'open',
    };
    console.log(payload);
    const currentBill = await BillSaleModel.findOne(payload);
    const item = {
      price: req.body.price,
      productId: req.body.id,
      billSaleId: currentBill.id,
      qty: 1,
      userId: payload.userId,
    };
    await BillSaleDetailModel.create(item);

    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
