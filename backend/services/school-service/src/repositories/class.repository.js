const Class = require('../models/Class.js');
const AcademicYear = require('../models/AcademicYear.js');

const getAllClasses = async () => {
  return await Class.findAll({
    include: [{
      model: AcademicYear,
      as: 'academicYear',
      attributes: ['id', 'name', 'startYear', 'endYear']
    }],
    order: [['gradeLevel', 'ASC'], ['section', 'ASC']]
  });
};

const getClassById = async (id) => {
  return await Class.findByPk(id, {
    include: [{
      model: AcademicYear,
      as: 'academicYear',
      attributes: ['id', 'name', 'startYear', 'endYear']
    }]
  });
};

const getClassesByAcademicYear = async (academicYearId) => {
  return await Class.findAll({
    where: { academicYearId: academicYearId },
    include: [{
      model: AcademicYear,
      as: 'academicYear',
      attributes: ['id', 'name', 'startYear', 'endYear']
    }],
    order: [['gradeLevel', 'ASC'], ['section', 'ASC']]
  });
};

const getClassesByGradeLevel = async (gradeLevel) => {
  return await Class.findAll({
    where: { gradeLevel: gradeLevel },
    include: [{
      model: AcademicYear,
      as: 'academicYear',
      attributes: ['id', 'name', 'startYear', 'endYear']
    }],
    order: [['section', 'ASC']]
  });
};

const createClass = async (classData) => {
  const { schoolId, academicYearId, gradeLevel, section, name, classTeacherId, capacity } = classData;
  return await Class.create({
    schoolId,
    academicYearId,
    gradeLevel,
    section,
    name,
    classTeacherId,
    capacity: capacity || 30
  });
};

const updateClass = async (id, classData) => {
  const { schoolId, academicYearId, gradeLevel, section, name, classTeacherId, capacity } = classData;
  const [affectedRows] = await Class.update({
    schoolId,
    academicYearId,
    gradeLevel,
    section,
    name,
    classTeacherId,
    capacity
  }, {
    where: { id }
  });
  return affectedRows > 0;
};

const deleteClass = async (id) => {
  const affectedRows = await Class.destroy({
    where: { id }
  });
  return affectedRows > 0;
};

const getStudentsInClass = async (classId) => {
  // This would need a Student model to be implemented
  // For now, return empty array
  return [];
};

module.exports = {
  getAllClasses,
  getClassById,
  getClassesByAcademicYear,
  getClassesByGradeLevel,
  createClass,
  updateClass,
  deleteClass,
  getStudentsInClass
};
