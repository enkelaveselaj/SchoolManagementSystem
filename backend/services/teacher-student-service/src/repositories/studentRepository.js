import db from "../models/index.js";

const { Student } = db;

export const createStudent = async (data) => {
  return await Student.create(data);
};

export const getAllStudents = async () => {
  return await Student.findAll();
};

export const getStudentById = async (id) => {
  return await Student.findByPk(id);
};

export const updateStudent = async (id, data) => {
  const student = await Student.findByPk(id);

  if (!student) return null;

  await student.update(data);

  return student;
};

export const deleteStudent = async (id) => {
  const student = await Student.findByPk(id);

  if (!student) return null;

  await student.destroy();

  return true;
};