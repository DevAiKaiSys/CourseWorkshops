const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const UserModel = sequelize.define('user', {
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
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// UserModel.sync({ alter: true });

module.exports = UserModel;
