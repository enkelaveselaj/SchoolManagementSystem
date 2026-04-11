const AcademicYear = require('../models/AcademicYear.js');

const getAllAcademicYears = async () => {
  return await AcademicYear.findAll({
    order: [['start_year', 'DESC']]
  });
};

const getAcademicYearById = async (id) => {
  return await AcademicYear.findByPk(id);
};

const createAcademicYear = async (academicYear) => {
  const { name, startYear, endYear, isCurrent } = academicYear;
  return await AcademicYear.create({
    name,
    start_year: startYear,
    end_year: endYear,
    is_current: isCurrent || false
  });
};

const updateAcademicYear = async (id, academicYear) => {
  const { name, startYear, endYear, isCurrent } = academicYear;
  const [affectedRows] = await AcademicYear.update({
    name,
    start_year: startYear,
    end_year: endYear,
    is_current: isCurrent
  }, {
    where: { id }
  });
  return affectedRows > 0;
};

const deleteAcademicYear = async (id) => {
  const affectedRows = await AcademicYear.destroy({
    where: { id }
  });
  return affectedRows > 0;
};

const getCurrentAcademicYear = async () => {
  return await AcademicYear.findOne({
    where: { is_current: true }
  });
};

const setCurrentAcademicYear = async (id) => {
  // First, set all academic years to not current
  await AcademicYear.update(
    { is_current: false },
    { where: {} }
  );
  
  // Then set the specified academic year as current
  const [affectedRows] = await AcademicYear.update(
    { is_current: true },
    { where: { id } }
  );
  return affectedRows > 0;
};

module.exports = {
  getAllAcademicYears,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  getCurrentAcademicYear,
  setCurrentAcademicYear
};
