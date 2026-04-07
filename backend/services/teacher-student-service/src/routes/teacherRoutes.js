// src/routes/teacherAssignmentRoutes.js
import express from "express";
import * as controller from "../controllers/teacherAssignmentController.js";

const router = express.Router();

router.post("/", controller.createAssignment);
router.get("/", controller.getAllAssignments);
router.get("/:id", controller.getAssignmentById);
router.put("/:id", controller.updateAssignment);
router.delete("/:id", controller.deleteAssignment);

export default router;