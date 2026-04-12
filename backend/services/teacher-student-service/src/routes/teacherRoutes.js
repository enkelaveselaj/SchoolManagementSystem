// src/routes/teacherRoutes.js
import express from "express";
import * as controller from "../controllers/teacherController.js";

const router = express.Router();

router.post("/", controller.createTeacher);
router.get("/", controller.getAllTeachers);
router.get("/:id", controller.getTeacherById);
router.put("/:id", controller.updateTeacher);
router.delete("/:id", controller.deleteTeacher);

export default router;