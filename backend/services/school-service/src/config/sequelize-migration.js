const sequelize = require('./database');
const AcademicYear = require('../models/AcademicYear.js');
const Class = require('../models/Class.js');
const Section = require('../models/Section.js');
const School = require('../models/school.model.js');

const runMigration = async () => {
  try {
    console.log('Starting database migration...');
    
    // Sync all models with database
    await sequelize.sync({ force: false, alter: true });
    
    console.log('Database migration completed successfully!');
    console.log('Tables created/updated:');
    console.log('- academic_years');
    console.log('- classes');
    console.log('- sections');
    console.log('- schools');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
