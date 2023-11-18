const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const AdminModel = sequelize.define('admin', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  usr: {
    type: DataTypes.STRING,
  },
  pwd: {
    type: DataTypes.STRING,
  },
  level: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// AdminModel.sync({ alter: true });

module.exports = AdminModel;
