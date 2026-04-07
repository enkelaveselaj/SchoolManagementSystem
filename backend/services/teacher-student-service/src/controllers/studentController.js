// src/controllers/studentController.js
import db from "../models/index.js";

export const createStudent = async (req, res) => {
  try {
    const student = await db.Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await db.Student.findAll();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await db.Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await db.Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    await student.update(req.body);
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await db.Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    await student.destroy();
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};