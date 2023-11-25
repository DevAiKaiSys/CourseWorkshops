const express = require('express');
const app = express();
const ChangePackageModel = require('../models/ChangePackageModel');
const { isLogin } = require('./Service');
const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');

app.get('/changePackage/list', isLogin, async (req, res) => {
  try {
    ChangePackageModel.belongsTo(PackageModel);
    ChangePackageModel.belongsTo(MemberModel, {
      // foreignKey: {
      //   name: 'userId',
      // },
    });

    const results = await ChangePackageModel.findAll({
      order: [['id', 'DESC']],
      include: [
        {
          model: PackageModel,
        },
        {
          model: MemberModel,
        },
      ],
    });
    res.status(200).send({ message: 'success', results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/changePackage/saveChange', isLogin, async (req, res) => {
  try {
    await ChangePackageModel.update(req.body, {
      where: { id: req.body.id },
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
