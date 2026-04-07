import express from "express";
import * as controller from "../controllers/teacherController.js";

const router = express.Router();

router.post("/", controller.createTeacher);
router.get("/", controller.getAllTeachers);

export default router; 