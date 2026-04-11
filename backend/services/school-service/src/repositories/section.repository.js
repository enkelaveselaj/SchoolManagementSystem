const Section = require('../models/Section.js');
const Class = require('../models/Class.js');

const getAllSections = async () => {
  return await Section.findAll({
    include: [{
      model: Class,
      as: 'class',
      attributes: ['id', 'name', 'grade_level']
    }],
    order: [['class.grade_level', 'ASC'], ['name', 'ASC']]
  });
};

const getSectionById = async (id) => {
  return await Section.findByPk(id, {
    include: [{
      model: Class,
      as: 'class',
      attributes: ['id', 'name', 'grade_level']
    }]
  });
};

const getSectionsByClass = async (classId) => {
  return await Section.findAll({
    where: { class_id: classId },
    include: [{
      model: Class,
      as: 'class',
      attributes: ['id', 'name', 'grade_level']
    }],
    order: [['name', 'ASC']]
  });
};

const createSection = async (sectionData) => {
  const { classId, name, capacity, roomNumber } = sectionData;
  return await Section.create({
    class_id: classId,
    name: name,
    capacity: capacity || 30,
    room_number: roomNumber
  });
};

const updateSection = async (id, sectionData) => {
  const { classId, name, capacity, roomNumber } = sectionData;
  const [affectedRows] = await Section.update({
    class_id: classId,
    name: name,
    capacity: capacity,
    room_number: roomNumber
  }, {
    where: { id }
  });
  return affectedRows > 0;
};

const deleteSection = async (id) => {
  const affectedRows = await Section.destroy({
    where: { id }
  });
  return affectedRows > 0;
};

const getStudentsInSection = async (sectionId) => {
  // This would need a Student model to be implemented
  // For now, return empty array
  return [];
};

const getSectionCapacity = async (sectionId) => {
  // This would need a Student model to be implemented
  // For now, return basic capacity info
  const section = await Section.findByPk(sectionId);
  if (!section) return null;
  
  return {
    capacity: section.capacity,
    enrolled_students: 0,
    available_slots: section.capacity
  };
};

module.exports = {
  getAllSections,
  getSectionById,
  getSectionsByClass,
  createSection,
  updateSection,
  deleteSection,
  getStudentsInSection,
  getSectionCapacity
};
