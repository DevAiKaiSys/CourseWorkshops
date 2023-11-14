const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const BillSaleModel = require('../models/BillSaleModel');
const BillSaleDetailModel = require('../models/BillSaleDetailModel');
const ProductModel = require('../models/ProductModel');
const { getMemberId, isLogin } = require('./Service');
const { Sequelize, Op } = require('sequelize');

require('dotenv').config();

app.get('/billSale/openBill', isLogin, async (req, res) => {
  try {
    const payload = {
      userId: getMemberId(req),
      status: 'open',
    };
    const result = await BillSaleModel.findOrCreate({
      where: payload,
    });
    res.status(200).send({ result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/billSale/sale', async (req, res) => {
  try {
    const payload = {
      userId: getMemberId(req),
      status: 'open',
    };
    const currentBill = await BillSaleModel.findOne({
      where: payload,
    });
    const item = {
      price: req.body.price,
      productId: req.body.id,
      billSaleId: currentBill.id,
      userId: payload.userId,
    };
    const billSaleDetail = await BillSaleDetailModel.findOne({
      where: item,
    });
    if (billSaleDetail == null) {
      item.qty = 1;
      await BillSaleDetailModel.create(item);
    } else {
      item.qty = parseInt(billSaleDetail.qty) + 1;
      await BillSaleDetailModel.update(item, {
        where: { id: billSaleDetail.id },
      });
    }

    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/billSale/currentBillInfo', isLogin, async (req, res) => {
  try {
    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const result = await BillSaleModel.findOne({
      where: { status: 'open', userId: getMemberId(req) },
      include: {
        model: BillSaleDetailModel,
        order: [['id', 'DESC']],
        include: {
          model: ProductModel,
          attributes: ['name'],
        },
      },
    });

    res.status(200).send({ result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/billSale/deleteItem/:id', isLogin, async (req, res) => {
  try {
    await BillSaleDetailModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/billSale/updateQty', isLogin, async (req, res) => {
  try {
    await BillSaleDetailModel.update(
      { qty: req.body.qty },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/billSale/endSale', isLogin, async (req, res) => {
  try {
    await BillSaleModel.update(
      { status: 'pay' },
      {
        where: {
          status: 'open',
          userId: getMemberId(req),
        },
      }
    );
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/billSale/lastBill', isLogin, async (req, res) => {
  try {
    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const result = await BillSaleModel.findAll({
      where: {
        status: 'pay',
        userId: getMemberId(req),
      },
      order: [['id', 'DESC']],
      limit: 1,
      include: {
        model: BillSaleDetailModel,
        attributes: ['qty', 'price'],
        include: {
          model: ProductModel,
          attributes: ['barcode', 'name'],
        },
      },
    });
    res.status(200).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/billSale/billToday', isLogin, async (req, res) => {
  try {
    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const now = new Date();
    const Op = Sequelize.Op;

    const results = await BillSaleModel.findAll({
      where: {
        status: 'pay',
        userId: getMemberId(req),
        createdAt: {
          [Op.between]: [startDate.toString(), now.toString()],
        },
      },
      order: [['id', 'DESC']],
      include: {
        model: BillSaleDetailModel,
        attributes: ['qty', 'price'],
        include: {
          model: ProductModel,
          attributes: ['barcode', 'name'],
        },
      },
    });
    res.status(200).send({ message: 'success', results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/billSale/list', isLogin, async (req, res) => {
  try {
    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const results = await BillSaleModel.findAll({
      where: {
        status: 'pay',
        userId: getMemberId(req),
      },
      order: [['id', 'DESC']],
      include: {
        model: BillSaleDetailModel,
        attributes: ['qty', 'price'],
        include: {
          model: ProductModel,
          attributes: ['barcode', 'name'],
        },
      },
    });
    res.status(200).send({ message: 'success', results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get(
  '/billSale/listByYearAndMonth/:year/:month',
  isLogin,
  async (req, res) => {
    // let arr = [];
    let y = req.params.year;
    let m = req.params.month - 1;
    let daysInMonth_start = new Date(y, m, 1);
    let daysInMonth_end = new Date(y, m, 1);
    daysInMonth_end.setMonth(daysInMonth_end.getMonth() + 1);

    // console.log(y);
    // console.log(m);
    // console.log(daysInMonth_start);
    // console.log(daysInMonth_end);

    // const year = parseInt(req.params.year, 10);
    // const month = parseInt(req.params.month, 10);

    // const lastMonth = month === 1 ? 12 : month - 1;
    // const lastMonthYear = month === 1 ? year - 1 : year;

    // const lastMonthStart = new Date(lastMonthYear, lastMonth - 1, 1);
    // const lastMonthEnd = new Date(year, month - 1, 0);

    // console.log(year);
    // console.log(month);
    // console.log(lastMonthStart);
    // console.log(lastMonthEnd);

    try {
      BillSaleModel.hasMany(BillSaleDetailModel);
      BillSaleDetailModel.belongsTo(ProductModel);

      const results = await BillSaleModel.findAll({
        where: {
          status: 'pay',
          userId: getMemberId(req),
          createdAt: {
            [Op.gte]: daysInMonth_start,
            [Op.lt]: daysInMonth_end,
          },
        },
        include: {
          model: BillSaleDetailModel,
          // attributes: ['qty', 'price'],
          include: {
            model: ProductModel,
            // attributes: ['barcode', 'name'],
          },
        },
        // order: [['id', 'DESC']],
        // attributes: [
        //   // [Sequelize.fn('DAY', Sequelize.col('createdAt')), 'day'], // error
        //   [
        //     Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt')),
        //     'day',
        //   ],
        //   [Sequelize.literal('COUNT(*)'), 'results'],
        // ],
        // where: {
        //   createdAt: {
        //     // [Op.between]: [daysInMonth_start, daysInMonth_end],
        //     [Op.gte]: daysInMonth_start,
        //     [Op.lt]: daysInMonth_end,
        //   },
        // },
        // group: ['day'],
      });

      // Organize results by day
      // const resultsByDay = {};
      // results.forEach((result) => {
      //   const day = result.createdAt.getDate();
      //   if (!resultsByDay[day]) {
      //     resultsByDay[day] = [];
      //   }
      //   resultsByDay[day].push(result);
      // });

      // Group results by day
      const resultsByDay = results.reduce((acc, item) => {
        const day = item.createdAt.getDate();

        if (!acc[day]) {
          acc[day] = { day, results: [] };
        }

        acc[day].results.push(item);

        return acc;
      }, {});

      // Convert resultsByDay object to an array of objects
      const finalResults = Object.values(resultsByDay);

      res.status(200).send({ message: 'success', results: finalResults });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

module.exports = app;
