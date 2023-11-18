const express = require('express');
const app = express();
const AdminModel = require('../models/AdminModel');

app.get('/user/list', async (req, res) => {
  try {
    const results = await AdminModel.findAll({
      where: { userId: getMemberId(req) },
      attributes: ['id', 'level', 'name', 'usr'],
      order: [['id', 'DESC']],
    });
    res.status(200).send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
