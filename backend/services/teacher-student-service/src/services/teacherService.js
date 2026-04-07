import * as teacherRepository from "../repositories/teacherRepository.js";

export const createTeacher = async (data) => {
  if (!data.userId) {
    throw new Error("userId is required");
  }

  return await teacherRepository.createTeacher(data);
};

export const getAllTeachers = async () => {
  return await teacherRepository.getAllTeachers();
};

export const getTeacherById = async (id) => {
  const teacher = await teacherRepository.getTeacherById(id);

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return teacher;
};

export const updateTeacher = async (id, data) => {
  const updated = await teacherRepository.updateTeacher(id, data);

  if (!updated) {
    throw new Error("Teacher not found");
  }

  return updated;
};

export const deleteTeacher = async (id) => {
  const deleted = await teacherRepository.deleteTeacher(id);

  if (!deleted) {
    throw new Error("Teacher not found");
  }

  return deleted;
};