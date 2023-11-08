const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const BillSaleModel = require('../models/BillSaleModel');
const BillSaleDetailModel = require('../models/BillSaleDetailModel');
const ProductModel = require('../models/ProductModel');
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

app.get('/billSale/currentBillInfo', isLogin, async (req, res) => {
  try {
    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const result = await BillSaleModel.findOne({
      where: { status: 'open', userId: getMemberId(req) },
      include: {
        model: BillSaleDetailModel,
        order: [['id', 'DESC']],
        include: {
          model: ProductModel,
          attributes: ['name'],
        },
      },
    });

    res.status(200).send({ result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/billSale/deleteItem/:id', isLogin, async (req, res) => {
  try {
    await BillSaleDetailModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/billSale/updateQty', isLogin, async (req, res) => {
  try {
    await BillSaleDetailModel.update(
      { qty: req.body.qty },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/billSale/endSale', isLogin, async (req, res) => {
  try {
    await BillSaleModel.update(
      { status: 'pay' },
      {
        where: {
          status: 'open',
          userId: getMemberId(req),
        },
      }
    );
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/billSale/lastBill', isLogin, async (req, res) => {
  try {
    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const result = await BillSaleModel.findAll({
      where: {
        status: 'pay',
        userId: getMemberId(req),
      },
      order: [['id', 'DESC']],
      limit: 1,
      include: {
        model: BillSaleDetailModel,
        attributes: ['qty', 'price'],
        include: {
          model: ProductModel,
          attributes: ['barcode', 'name'],
        },
      },
    });
    res.status(200).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
