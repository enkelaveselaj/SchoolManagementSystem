const Section = require('../models/Section.js');
const Class = require('../models/Class.js');

const getAllSections = async () => {
  return await Section.findAll({
    order: [['name', 'ASC']]
  });
};

const getSectionById = async (id) => {
  return await Section.findByPk(id);
};

const getSectionsByClass = async (classId) => {
  return await Section.findAll({
    where: { classId: classId },
    order: [['name', 'ASC']]
  });
};

const createSection = async (sectionData) => {
  const { classId, name, capacity, roomNumber } = sectionData;
  return await Section.create({
    classId,
    name,
    capacity: capacity || 30,
    roomNumber
  });
};

const updateSection = async (id, sectionData) => {
  const { classId, name, capacity, roomNumber } = sectionData;
  const updateData = {};
  
  if (classId !== undefined) updateData.classId = classId;
  if (name !== undefined) updateData.name = name;
  if (capacity !== undefined) updateData.capacity = capacity;
  if (roomNumber !== undefined) updateData.roomNumber = roomNumber;
  
  const [affectedRows] = await Section.update(updateData, {
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
