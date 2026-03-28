import { createUser } from "../services/adminService.js";

export const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body, req.user);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

import { linkParentToStudent } from "../services/adminService.js";

export const linkParentStudentController = async (req, res) => {
  try {
    const { parent_id, student_id } = req.body;

    const result = await linkParentToStudent(parent_id, student_id);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};