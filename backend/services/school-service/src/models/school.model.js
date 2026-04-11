const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  founded: {
    type: DataTypes.INTEGER,
    defaultValue: 1985
  },
  students: {
    type: DataTypes.INTEGER,
    defaultValue: 1200
  },
  teachers: {
    type: DataTypes.INTEGER,
    defaultValue: 85
  },
  programs: {
    type: DataTypes.INTEGER,
    defaultValue: 25
  }
}, {
  tableName: 'schools',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = School;