const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const Subject = require('./subject')(sequelize, DataTypes);
const Attendance = require('./attendance')(sequelize, DataTypes);
const Timetable = require('./timetable')(sequelize, DataTypes); 
const Assessment = require('./assessment')(sequelize,DataTypes);
const Grade = require('./grade')(sequelize, DataTypes);

module.exports = { sequelize, Subject, Attendance, Timetable, Assessment, Grade };