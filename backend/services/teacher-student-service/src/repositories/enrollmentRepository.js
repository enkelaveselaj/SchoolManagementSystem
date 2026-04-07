import db from "../models/index.js";

const { Enrollment } = db;

export const createEnrollment = async (data) => {
  return await Enrollment.create(data);
};

export const getAllEnrollments = async () => {
  return await Enrollment.findAll();
};

export const getEnrollmentById = async (id) => {
  return await Enrollment.findByPk(id);
};

export const getEnrollmentsByStudentId = async (studentId) => {
  return await Enrollment.findAll({
    where: { studentId },
  });
};

export const updateEnrollment = async (id, data) => {
  const enrollment = await Enrollment.findByPk(id);

  if (!enrollment) return null;

  await enrollment.update(data);

  return enrollment;
};

export const deleteEnrollment = async (id) => {
  const enrollment = await Enrollment.findByPk(id);

  if (!enrollment) return null;

  await enrollment.destroy();

  return true;
};