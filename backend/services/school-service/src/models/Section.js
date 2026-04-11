const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'class_id'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    validate: {
      min: 1
    }
  },
  roomNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'room_number'
  }
}, {
  tableName: 'sections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['class_id']
    },
    {
      fields: ['room_number']
    }
  ]
});

module.exports = Section;
