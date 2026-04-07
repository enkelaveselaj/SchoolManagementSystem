// src/routes/studentRoutes.js
import express from "express";
import * as controller from "../controllers/studentController.js";

const router = express.Router();

router.post("/", controller.createStudent);
router.get("/", controller.getAllStudents);
router.get("/:id", controller.getStudentById);
router.put("/:id", controller.updateStudent);
router.delete("/:id", controller.deleteStudent);

export default router;