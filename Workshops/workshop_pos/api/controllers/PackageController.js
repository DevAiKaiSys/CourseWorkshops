const express = require('express');
const app = express();
const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');
const { isLogin, getMemberId } = require('./Service');
const BillSaleModel = require('../models/BillSaleModel');
const { Op, Sequelize } = require('sequelize');
// const BankModel = require('../models/BankModel');

app.get('/package/list', async (req, res) => {
  //   res.send('test');
  try {
    const results = await PackageModel.findAll({ order: ['price'] });
    res.status(200).send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/package/memberRegister', async (req, res) => {
  try {
    const result = await MemberModel.create(req.body);
    res.send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/package/countBill', isLogin, async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are zero-based

    const results = await BillSaleModel.findAll({
      where: {
        userId: getMemberId(req),
        // [Op.and]: [
        //   Sequelize.literal(
        //     `EXTRACT(MONTH FROM "createdAt") = ${currentMonth}`
        //   ),
        // ],
        // createdAt: {
        //   [Op.gte]: Sequelize.fn(
        //     'DATE_TRUNC',
        //     'month',
        //     Sequelize.literal('CURRENT_DATE')
        //   ),
        // },
        [Op.and]: Sequelize.where(
          Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "createdAt"')),
          currentMonth
        ),

        // error function month(timestamp with time zone) does not exist
        // createdAt: {
        //   [Op.and]: [
        //     Sequelize.where(
        //       Sequelize.fn('MONTH', Sequelize.col('createdAt')),
        //       '=',
        //       currentMonth
        //     ),
        //   ],
        // },
      },
    });

    res.status(200).send({ totalBill: results.length });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
