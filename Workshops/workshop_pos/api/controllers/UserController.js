const express = require('express');
const app = express();
const { isLogin } = require('./Service');
const UserModel = require('../models/UserModel');

// app.get('/user/list', isLogin, async (req, res) => {
//   try {
//     const results = await UserModel.findAll({ order: [['id', 'DESC']] });
//     res.status(200).send({ results: results });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

app.post('/user/insert', isLogin, async (req, res) => {
  try {
    const result = await UserModel.create(req.body);
    res.status(201).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// app.delete('/user/delete/:id', isLogin, async (req, res) => {
//   try {
//     const result = await UserModel.destroy({ where: { id: req.params.id } });
//     res.status(200).send({ message: 'success', result: result });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// app.post('/user/update', isLogin, async (req, res) => {
//   try {
//     const result = await UserModel.update(req.body, {
//       where: { id: req.body.id },
//     });
//     res.status(200).send({ message: 'success', result: result });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

module.exports = app;
