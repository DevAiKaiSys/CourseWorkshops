const express = require('express');
const app = express();
const MemberModel = require('../models/MemberModel');
const jwt = require('jsonwebtoken');
const { getToken } = require('./Service');
const PackageModel = require('../models/PackageModel');

require('dotenv').config();

app.post('/member/signin', async (req, res) => {
  try {
    const member = await MemberModel.findAll({
      where: {
        phone: req.body.phone,
        pass: req.body.pass,
      },
    });
    if (member.length > 0) {
      //   return res.send({ id: member[0].id, message: 'success' });
      let token = jwt.sign({ id: member[0].id }, process.env.secret);
      return res.send({ token: token, message: 'success' });
    }
    res.status(401).send({ message: 'not found' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/member/info', async (req, res) => {
  try {
    MemberModel.belongsTo(PackageModel);

    const token = getToken(req);
    const payload = jwt.decode(token);
    const member = await MemberModel.findByPk(payload.id, {
      attributes: ['id', 'name'],
      include: [{ model: PackageModel, attributes: ['name'] }],
    });
    res.send({ result: member, message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
