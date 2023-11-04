const express = require('express');
const app = express();
const { isLogin, getMemberId } = require('./Service');
const UserModel = require('../models/UserModel');

app.get('/user/list', isLogin, async (req, res) => {
  try {
    const results = await UserModel.findAll({
      where: { userId: getMemberId(req) },
      attributes: ['id', 'level', 'name', 'usr'],
      order: [['id', 'DESC']],
    });
    res.status(200).send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/user/insert', isLogin, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = getMemberId(req);
    const result = await UserModel.create(payload);
    res.status(201).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/user/delete/:id', isLogin, async (req, res) => {
  try {
    const result = await UserModel.destroy({ where: { id: req.params.id } });
    res.status(200).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/user/update', isLogin, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = getMemberId(req);
    const result = await UserModel.update(payload, {
      where: { id: req.body.id },
    });
    res.status(200).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
