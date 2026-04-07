import * as assignmentRepository from "../repositories/teacherAssignmentRepository.js";

export const createAssignment = async (data) => {
  if (!data.teacherId || !data.subjectId) {
    throw new Error("teacherId and subjectId are required");
  }

  return await assignmentRepository.createTeacherAssignment(data);
};

export const getAllAssignments = async () => {
  return await assignmentRepository.getAllTeacherAssignments();
};

export const getAssignmentById = async (id) => {
  const assignment =
    await assignmentRepository.getTeacherAssignmentById(id);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return assignment;
};

export const updateAssignment = async (id, data) => {
  const updated =
    await assignmentRepository.updateTeacherAssignment(id, data);

  if (!updated) {
    throw new Error("Assignment not found");
  }

  return updated;
};

export const deleteAssignment = async (id) => {
  const deleted =
    await assignmentRepository.deleteTeacherAssignment(id);

  if (!deleted) {
    throw new Error("Assignment not found");
  }

  return deleted;
};