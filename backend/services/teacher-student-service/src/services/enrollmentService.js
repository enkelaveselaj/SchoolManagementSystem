import * as enrollmentRepository from "../repositories/enrollmentRepository.js";

export const createEnrollment = async (data) => {
  if (!data.studentId) {
    throw new Error("studentId is required");
  }

  return await enrollmentRepository.createEnrollment(data);
};

export const getAllEnrollments = async () => {
  return await enrollmentRepository.getAllEnrollments();
};

export const getEnrollmentById = async (id) => {
  const enrollment = await enrollmentRepository.getEnrollmentById(id);

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  return enrollment;
};

export const getEnrollmentsByStudentId = async (studentId) => {
  return await enrollmentRepository.getEnrollmentsByStudentId(studentId);
};

export const updateEnrollment = async (id, data) => {
  const updated = await enrollmentRepository.updateEnrollment(id, data);

  if (!updated) {
    throw new Error("Enrollment not found");
  }

  return updated;
};

export const deleteEnrollment = async (id) => {
  const deleted = await enrollmentRepository.deleteEnrollment(id);

  if (!deleted) {
    throw new Error("Enrollment not found");
  }

  return deleted;
};