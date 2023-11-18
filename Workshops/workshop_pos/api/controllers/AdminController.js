const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/AdminModel');

app.post('/admin/signin', async (req, res) => {
  try {
    const admin = await AdminModel.findOne({
      where: {
        usr: req.body.usr,
        pwd: req.body.pwd,
      },
    });
    if (admin) {
      let token = jwt.sign({ id: admin.id }, process.env.secret);
      return res.send({ token: token, message: 'success' });
    }
    res.status(401).send({ message: 'not found' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
