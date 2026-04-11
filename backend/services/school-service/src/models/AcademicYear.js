const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicYear = sequelize.define('AcademicYear', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  startYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'start_year',
    validate: {
      min: 2000,
      max: 2100
    }
  },
  endYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'end_year',
    validate: {
      min: 2000,
      max: 2100
    }
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_current'
  }
}, {
  tableName: 'academic_years',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['start_year']
    },
    {
      fields: ['is_current']
    }
  ]
});

module.exports = AcademicYear;
