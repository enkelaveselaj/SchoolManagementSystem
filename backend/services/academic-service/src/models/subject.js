// src/models/subject.js
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    id: {
      type: DataTypes.INTEGER,  // now DataTypes is defined
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('core', 'elective', 'optional'),
      allowNull: false,
      defaultValue: 'core',
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gradeLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'Subjects',
    timestamps: true,
    // This will automatically add the new columns to the table
    // if they don't exist, Sequelize will create them
    alter: true
  });

  return Subject;
};