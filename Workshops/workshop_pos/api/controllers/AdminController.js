const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/AdminModel');
const { isLogin, getAdminId } = require('./Service');

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

app.get('/admin/info', isLogin, async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const admin = await AdminModel.findByPk(adminId, {
      attributes: ['id', 'name', 'level', 'usr'],
    });
    res.send({ result: admin, message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/admin/create', async (req, res) => {
  try {
    const admin = await AdminModel.create(req.body);
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/admin/list', isLogin, async (req, res) => {
  try {
    const results = await AdminModel.findAll({
      attributes: ['id', 'name', 'usr', 'level', 'email'],
    });
    res.send({ results: results, message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/admin/delete/:id', isLogin, async (req, res) => {
  try {
    await AdminModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/admin/edit/:id', isLogin, async (req, res) => {
  try {
    await AdminModel.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/admin/changeProfile', isLogin, async (req, res) => {
  try {
    await AdminModel.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
