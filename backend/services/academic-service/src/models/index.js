const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subject = require('./subject')(sequelize, DataTypes);
const Attendance = require('./attendance')(sequelize, DataTypes);
const Timetable = require('./timetable')(sequelize, DataTypes); 
const Assessment = require('./assessment')(sequelize,DataTypes);
const Grade = require('./grade')(sequelize, DataTypes);
const AssessmentScore = require('./assessmentScore')(sequelize, DataTypes);

const models = { sequelize, Subject, Attendance, Timetable, Assessment, Grade, AssessmentScore };

// Set up associations
Object.keys(models).forEach(key => {
  if (models[key].associate) {
    models[key].associate(models);
  }
});

module.exports = models;