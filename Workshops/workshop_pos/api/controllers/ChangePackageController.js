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
          [Op.ne]: null,
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
          day: day + 1,
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

app.post('/changePackage/reportSumSalePerMonth', isLogin, async (req, res) => {
  try {
    let y = req.body.year;
    // let m = req.body.month;
    // let dayInMonth = new Date(y,m,0).getDate();

    ChangePackageModel.belongsTo(PackageModel);
    ChangePackageModel.belongsTo(MemberModel);

    const results = await ChangePackageModel.findAll({
      where: {
        // [Op.not]: [{ payDate: null }],
        payDate: {
          [Op.ne]: null,
        },
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn(
              'EXTRACT',
              Sequelize.literal('YEAR FROM "changePackage"."createdAt"')
            ),
            y
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

    // Calculate sum for each month
    const sumPerMonth = results.reduce((acc, result) => {
      const month = result.createdAt.getMonth();
      if (!acc[month]) {
        acc[month] = {
          month: month + 1,
          results: [],
          sum: 0,
        };
      }
      acc[month].results.push(result);
      acc[month].sum += result.package.price; // Assuming the field name is 'price'
      return acc;
    }, []);

    // Initialize months that have no results
    for (let i = 0; i < 12; i++) {
      if (!sumPerMonth[i]) {
        sumPerMonth[i] = {
          month: i + 1,
          results: [],
          sum: 0,
        };
      }
    }

    res.status(200).send({ message: 'success', results: sumPerMonth });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/changePackage/reportSumSalePerYear', isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const startYear = y - 10;
    let year_start = new Date(startYear, 0, 1);
    let year_end = new Date(y + 1, 0, 1);

    ChangePackageModel.belongsTo(PackageModel);
    ChangePackageModel.belongsTo(MemberModel);

    const results = await ChangePackageModel.findAll({
      where: {
        // [Op.not]: [{ payDate: null }],
        payDate: {
          [Op.ne]: null,
        },
        createdAt: {
          [Op.gte]: year_start,
          [Op.lt]: year_end,
        },
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

    // Calculate sum for each month
    const sumPerYear = results.reduce((acc, result) => {
      const year = result.createdAt.getFullYear();
      const index = 10 - (y - year); // 0-10
      if (!acc[index]) {
        acc[index] = {
          year: year,
          results: [],
          sum: 0,
        };
      }
      acc[index].results.push(result);
      acc[index].sum += result.package.price; // Assuming the field name is 'price'
      return acc;
    }, []);

    // Initialize months that have no results
    for (let i = 0; i <= 10; i++) {
      if (!sumPerYear[i]) {
        sumPerYear[i] = {
          year: startYear + i,
          results: [],
          sum: 0,
        };
      }
    }

    res.status(200).send({ message: 'success', results: sumPerYear });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
