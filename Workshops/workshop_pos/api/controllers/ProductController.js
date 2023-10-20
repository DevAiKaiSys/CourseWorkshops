const express = require('express');
const app = express();
const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');
const { isLogin } = require('./Service');
const ProductModel = require('../models/ProductModel');

app.get('/product/list', isLogin, async (req, res) => {
  try {
    const results = await ProductModel.findAll({ order: [['id', 'DESC']] });
    res.status(200).send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/product/insert', isLogin, async (req, res) => {
  try {
    const result = await ProductModel.create(req.body);
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

module.exports = app;
