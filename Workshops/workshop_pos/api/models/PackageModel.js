const { DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = require('../connect');

const PackageModel = sequelize.define('package', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
  },
  bill_amount: {
    type: DataTypes.BIGINT,
  },
  price: {
    type: DataTypes.BIGINT,
  },
});

module.exports = PackageModel;
