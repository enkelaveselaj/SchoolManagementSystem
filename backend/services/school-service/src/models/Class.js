const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  schoolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'school_id'
  },
  academicYearId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'academic_year_id'
  },
  gradeLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'grade_level',
    validate: {
      min: 1,
      max: 12
    }
  },
  section: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  classTeacherId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'class_teacher_id'
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'classes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['school_id', 'academic_year_id']
    },
    {
      fields: ['grade_level']
    },
    {
      fields: ['class_teacher_id']
    }
  ]
});

module.exports = Class;
