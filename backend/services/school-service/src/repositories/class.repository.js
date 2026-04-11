const Class = require('../models/Class.js');
const AcademicYear = require('../models/AcademicYear.js');

const getAllClasses = async () => {
  return await Class.findAll({
    include: [{
      model: AcademicYear,
      as: 'academicYear',
      attributes: ['id', 'name']
    }],
    order: [['grade_level', 'ASC'], ['section', 'ASC']]
  });
};

const getClassById = async (id) => {
  return await Class.findByPk(id, {
    include: [{
      model: AcademicYear,
      as: 'academicYear',
      attributes: ['id', 'name']
    }]
  });
};

const getClassesByAcademicYear = async (academicYearId) => {
  return await Class.findAll({
    where: { academic_year_id: academicYearId },
    include: [{
      model: AcademicYear,
      as: 'academicYear',
      attributes: ['id', 'name']
    }],
    order: [['grade_level', 'ASC'], ['section', 'ASC']]
  });
};

const getClassesByGradeLevel = async (gradeLevel) => {
  return await Class.findAll({
    where: { grade_level: gradeLevel },
    include: [{
      model: AcademicYear,
      as: 'academicYear',
      attributes: ['id', 'name']
    }],
    order: [['section', 'ASC']]
  });
};

const createClass = async (classData) => {
  const { schoolId, academicYearId, gradeLevel, section, name, classTeacherId, capacity } = classData;
  return await Class.create({
    school_id: schoolId,
    academic_year_id: academicYearId,
    grade_level: gradeLevel,
    section: section,
    name: name,
    class_teacher_id: classTeacherId,
    capacity: capacity || 30
  });
};

const updateClass = async (id, classData) => {
  const { schoolId, academicYearId, gradeLevel, section, name, classTeacherId, capacity } = classData;
  const [affectedRows] = await Class.update({
    school_id: schoolId,
    academic_year_id: academicYearId,
    grade_level: gradeLevel,
    section: section,
    name: name,
    class_teacher_id: classTeacherId,
    capacity: capacity
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
