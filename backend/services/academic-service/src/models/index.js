const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subject = require('./subject')(sequelize, DataTypes);
const Attendance = require('./attendance')(sequelize, DataTypes);
const Timetable = require('./timetable')(sequelize, DataTypes); 
const Assessment = require('./assessment')(sequelize,DataTypes);
const Grade = require('./grade')(sequelize, DataTypes);

module.exports = { sequelize, Subject, Attendance, Timetable, Assessment, Grade };