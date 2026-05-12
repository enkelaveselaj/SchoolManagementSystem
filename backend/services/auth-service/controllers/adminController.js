import { createUser, getParentsWithStudents, linkParentToStudent, assignParentToStudents, createTeacher, getParentChildren } from "../services/adminService.js";

export const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body, req.user);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const linkParentStudentController = async (req, res) => {
  try {
    const { parent_id, student_id } = req.body;

    const result = await linkParentToStudent(parent_id, student_id, req.user);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getParentsController = async (req, res) => {
  try {
    const parents = await getParentsWithStudents(req.user);
    res.json(parents);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const assignParentStudentsController = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { studentIds } = req.body;

    const result = await assignParentToStudents({ parentId: Number(parentId), studentIds }, req.user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createTeacherController = async (req, res) => {
  try {
    const teacher = await createTeacher(req.body, req.user);
    res.status(201).json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getParentChildrenController = async (req, res) => {
  try {
    const children = await getParentChildren(req.user);
    res.json(children);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};