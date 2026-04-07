// src/controllers/enrollmentController.js
import db from "../models/index.js";

export const createEnrollment = async (req, res) => {
  try {
    const enrollment = await db.Enrollment.create(req.body);
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await db.Enrollment.findAll({ include: db.Student });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await db.Enrollment.findByPk(req.params.id, { include: db.Student });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await db.Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    await enrollment.update(req.body);
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await db.Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    await enrollment.destroy();
    res.json({ message: "Enrollment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};