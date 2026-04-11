const sequelize = require('../config/database');
const School = require('./school.model');
const AcademicYear = require('./AcademicYear');
const Class = require('./Class');
const Section = require('./Section');

// Define associations
AcademicYear.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
School.hasMany(AcademicYear, { foreignKey: 'schoolId', as: 'academicYears' });

Class.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });
AcademicYear.hasMany(Class, { foreignKey: 'academicYearId', as: 'classes' });

Class.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
School.hasMany(Class, { foreignKey: 'schoolId', as: 'classes' });

Section.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Section, { foreignKey: 'classId', as: 'sections' });

Section.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });
AcademicYear.hasMany(Section, { foreignKey: 'academicYearId', as: 'sections' });

const db = {
  sequelize,
  School,
  AcademicYear,
  Class,
  Section
};

module.exports = db;
