const express = require('express');
const app = express();
const MemberModel = require('../models/MemberModel');

app.post('/member/signin', async (req, res) => {
  try {
    const member = await MemberModel.findAll({
      where: {
        phone: req.body.phone,
        pass: req.body.pass,
      },
    });
    if (member.length > 0) {
      return res.send({ id: member[0].id, message: 'success' });
    }
    res.status(401).send({ message: 'not found' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
