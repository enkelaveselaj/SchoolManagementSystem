// src/routes/teacherRoutes.js
import express from "express";
import * as controller from "../controllers/teacherController.js";

const router = express.Router();

router.post("/", controller.createTeacher);
router.get("/", controller.getAllTeachers);
router.get("/:id", controller.getTeacherById);
router.get("/user/:userId", controller.getTeacherByUserId);
router.put("/:id", controller.updateTeacher);
router.delete("/:id", controller.deleteTeacher);
router.post("/:teacherId/subjects/:subjectId", controller.assignTeacherToSubject);
router.get("/:teacherId/classes", controller.getTeacherClasses);

export default router;