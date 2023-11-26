const express = require('express');
const app = express();
const ChangePackageModel = require('../models/ChangePackageModel');
const { isLogin } = require('./Service');
const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');
const { Op, fn, col, Sequelize } = require('sequelize');

app.get('/changePackage/list', isLogin, async (req, res) => {
  try {
    ChangePackageModel.belongsTo(PackageModel);
    ChangePackageModel.belongsTo(MemberModel, {
      // foreignKey: {
      //   name: 'userId',
      // },
    });

    const results = await ChangePackageModel.findAll({
      where: {
        payDate: null,
      },
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

app.post('/changePackage/reportSumSalePerDay', isLogin, async (req, res) => {
  try {
    let y = req.body.year;
    let m = req.body.month;
    // let dayInMonth = new Date(y,m,0).getDate();

    ChangePackageModel.belongsTo(PackageModel);
    ChangePackageModel.belongsTo(MemberModel);

    const results = await ChangePackageModel.findAll({
      where: {
        // [Op.not]: [{ payDate: null }],
        payDate: {
          [Op.not]: null,
        },
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn(
              'EXTRACT',
              Sequelize.literal('YEAR FROM "changePackage"."createdAt"')
            ),
            y
          ),
          Sequelize.where(
            Sequelize.fn(
              'EXTRACT',
              Sequelize.literal('MONTH FROM "changePackage"."createdAt"')
            ),
            m
          ),
        ],
      },
      include: [
        {
          model: PackageModel,
          attributes: ['name', 'price'],
        },
        {
          model: MemberModel,
          attributes: ['name', 'phone'],
        },
      ],
    });

    // Calculate sum for each day
    const sumPerDay = results.reduce((acc, result) => {
      const day = result.createdAt.getDate() - 1;
      if (!acc[day]) {
        acc[day] = {
          day: day,
          results: [],
          sum: 0,
        };
      }
      acc[day].results.push(result);
      acc[day].sum += result.package.price; // Assuming the field name is 'price'
      return acc;
    }, []);

    const lastDayOfMonth = new Date(y, m, 0).getDate(); // Get the last day of the month

    // Initialize days that have no results
    for (let i = 0; i < lastDayOfMonth; i++) {
      if (!sumPerDay[i]) {
        sumPerDay[i] = {
          day: i + 1,
          results: [],
          sum: 0,
        };
      }
    }

    res.status(200).send({ message: 'success', results: sumPerDay });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
