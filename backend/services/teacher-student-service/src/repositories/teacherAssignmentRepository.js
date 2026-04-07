import db from "../models/index.js";

const { TeacherAssignment } = db;

export const createTeacherAssignment = async (data) => {
  return await TeacherAssignment.create(data);
};

export const getAllTeacherAssignments = async () => {
  return await TeacherAssignment.findAll();
};

export const getTeacherAssignmentById = async (id) => {
  return await TeacherAssignment.findByPk(id);
};

export const getAssignmentsByTeacherId = async (teacherId) => {
  return await TeacherAssignment.findAll({
    where: { teacherId },
  });
};

export const updateTeacherAssignment = async (id, data) => {
  const assignment = await TeacherAssignment.findByPk(id);

  if (!assignment) return null;

  await assignment.update(data);

  return assignment;
};

export const deleteTeacherAssignment = async (id) => {
  const assignment = await TeacherAssignment.findByPk(id);

  if (!assignment) return null;

  await assignment.destroy();

  return true;
};