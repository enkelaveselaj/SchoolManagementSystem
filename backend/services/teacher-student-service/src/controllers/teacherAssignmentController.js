// src/controllers/teacherAssignmentController.js
import db from "../models/index.js";

export const createAssignment = async (req, res) => {
  try {
    const assignment = await db.TeacherAssignment.create(req.body);
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await db.TeacherAssignment.findAll({ include: db.Teacher });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await db.TeacherAssignment.findByPk(req.params.id, { include: db.Teacher });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await db.TeacherAssignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    await assignment.update(req.body);
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await db.TeacherAssignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    await assignment.destroy();
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};