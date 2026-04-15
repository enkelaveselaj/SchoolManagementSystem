const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({
  override: true,
  path: path.resolve(__dirname, '../../.env')
});

const resolvedDbHost =
  (process.env.DB_HOST && process.env.DB_HOST.toLowerCase() === 'local')
    ? 'localhost'
    : (process.env.DB_HOST || 'localhost');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'school_management',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: resolvedDbHost,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
