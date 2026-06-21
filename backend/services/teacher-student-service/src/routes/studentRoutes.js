import express from "express";
import * as controller from "../controllers/studentController.js";

const router = express.Router();

router.get("/all", controller.getAllStudents);
router.get("/class/:classId", controller.getStudentsByClass);
router.get("/section/:sectionId", controller.getStudentsBySection);
router.get("/:id", controller.getStudentById);
router.post("/", controller.createStudent);
router.put("/:id", controller.updateStudent);
router.delete("/:id", controller.deleteStudent);
router.get("/", controller.getAllStudents);

export default router;