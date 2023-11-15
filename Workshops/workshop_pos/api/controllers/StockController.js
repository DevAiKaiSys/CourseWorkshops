const express = require('express');
const app = express();
const { isLogin, getMemberId } = require('./Service');
const StockModel = require('../models/StockModel');
const ProductModel = require('../models/ProductModel');
const BillSaleDetailModel = require('../models/BillSaleDetailModel');

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

app.delete('/stock/delete/:id', isLogin, async (req, res) => {
  try {
    const result = await StockModel.destroy({ where: { id: req.params.id } });
    res.status(200).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/stock/report', isLogin, async (req, res) => {
  try {
    ProductModel.hasMany(StockModel);
    ProductModel.hasMany(BillSaleDetailModel);

    let arr = [];
    const results = await ProductModel.findAll({
      include: [
        // {
        //   model: StockModel,
        // },
        // {
        //   model: BillSaleDetailModel,
        // },
        StockModel,
        BillSaleDetailModel,
      ],
      where: {
        userId: getMemberId(req),
      },
    });

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const stocks = result.stocks;
      const billSaleDetails = result.billSaleDetails;

      let stockIn = 0;
      let stockOut = 0;

      for (let j = 0; j < stocks; j++) {
        const item = stocks[j];
        stockIn += parseInt(item.qty);
      }

      for (let j = 0; j < billSaleDetails; j++) {
        const item = billSaleDetails[j];
        stockOut += parseInt(item.qty);
      }

      arr.push({
        result: result,
        stockIn: stockIn,
        stockOut: stockOut,
      });
    }

    res.status(200).send({ results: arr });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
