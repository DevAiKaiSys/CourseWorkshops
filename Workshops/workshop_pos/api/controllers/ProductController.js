const express = require('express');
const app = express();
const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');
const { isLogin } = require('./Service');
const ProductModel = require('../models/ProductModel');

// app.get('/package/list', async (req, res) => {
//   //   res.send('test');
//   try {
//     const results = await PackageModel.findAll({ order: ['price'] });
//     res.send({ results: results });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

app.post('/product/insert', isLogin, async (req, res) => {
  try {
    const result = await ProductModel.create(req.body);
    res.status(201).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
