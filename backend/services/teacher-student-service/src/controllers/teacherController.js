// src/controllers/teacherController.js
import db from "../models/index.js";

export const createTeacher = async (req, res) => {
  try {
    const teacher = await db.Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await db.Teacher.findAll();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await db.Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await db.Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    await teacher.update(req.body);
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await db.Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    await teacher.destroy();
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeacherByUserId = async (req, res) => {
  try {
    const teacher = await db.Teacher.findOne({ where: { userId: req.params.userId } });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignTeacherToSubject = async (req, res) => {
  try {
    const { teacherId, subjectId } = req.params;
    
    // Check if teacher exists
    const teacher = await db.Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Create assignment
    const assignment = await db.TeacherAssignment.create({
      teacherId: parseInt(teacherId),
      subjectId: parseInt(subjectId)
    });

    res.status(201).json({ 
      message: "Teacher assigned to subject successfully",
      assignment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};