const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'usd',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'created',
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Payment;
