const express = require('express');
const app = express();
const MemberModel = require('../models/MemberModel');
const jwt = require('jsonwebtoken');
const { isLogin, getMemberId } = require('./Service');
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

app.get('/member/info', isLogin, async (req, res) => {
  try {
    MemberModel.belongsTo(PackageModel);

    const memberId = getMemberId(req);
    // console.log(memberId);
    const member = await MemberModel.findByPk(memberId, {
      attributes: ['id', 'name'],
      include: [{ model: PackageModel, attributes: ['name', 'bill_amount'] }],
    });
    res.send({ result: member, message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put('/member/changeProfile', isLogin, async (req, res) => {
  try {
    const memberId = getMemberId(req);
    const payload = { name: req.body.memberName };
    const result = await MemberModel.update(payload, {
      where: {
        id: memberId,
      },
    });
    res.send({ message: 'success', result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
