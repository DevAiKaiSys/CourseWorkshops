const express = require('express');
const app = express();
const { isLogin, getMemberId } = require('./Service');
const ProductModel = require('../models/ProductModel');

app.get('/product/list', isLogin, async (req, res) => {
  try {
    const results = await ProductModel.findAll({
      where: { userId: getMemberId(req) },
      order: [['id', 'DESC']],
    });
    res.status(200).send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/product/insert', isLogin, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = getMemberId(req);
    const result = await ProductModel.create(payload);
    res.status(201).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/product/delete/:id', isLogin, async (req, res) => {
  try {
    const result = await ProductModel.destroy({ where: { id: req.params.id } });
    res.status(200).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/product/update', isLogin, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = getMemberId(req);
    const result = await ProductModel.update(payload, {
      where: { id: req.body.id },
    });
    res.status(200).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/product/listForSale', isLogin, async (req, res) => {
  const ProductImageModel = require('../models/ProductImageModel');
  ProductModel.hasMany(ProductImageModel);
  try {
    const results = await ProductModel.findAll({
      where: { userId: getMemberId(req) },
      order: [['id', 'DESC']],
      include: {
        model: ProductImageModel,
        where: {
          isMain: true,
        },
      },
    });
    res.status(200).send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
