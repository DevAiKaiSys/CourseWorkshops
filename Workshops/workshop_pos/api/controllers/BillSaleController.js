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
    const currentBill = await BillSaleModel.findOne({
      where: payload,
    });
    const item = {
      price: req.body.price,
      productId: req.body.id,
      billSaleId: currentBill.id,
      userId: payload.userId,
    };
    const billSaleDetail = await BillSaleDetailModel.findOne({
      where: item,
    });
    if (billSaleDetail == null) {
      item.qty = 1;
      await BillSaleDetailModel.create(item);
    } else {
      item.qty = parseInt(billSaleDetail.qty) + 1;
      await BillSaleDetailModel.update(item, {
        where: { id: billSaleDetail.id },
      });
    }

    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
