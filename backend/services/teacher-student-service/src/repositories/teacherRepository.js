import db from "../models/index.js";

const { Teacher } = db;

export const createTeacher = async (data) => {
  return await Teacher.create(data);
};

export const getAllTeachers = async () => {
  return await Teacher.findAll();
};

export const getTeacherById = async (id) => {
  return await Teacher.findByPk(id);
};

export const updateTeacher = async (id, data) => {
  const teacher = await Teacher.findByPk(id);

  if (!teacher) return null;

  await teacher.update(data);

  return teacher;
};

export const deleteTeacher = async (id) => {
  const teacher = await Teacher.findByPk(id);

  if (!teacher) return null;

  await teacher.destroy();

  return true;
};