// src/routes/enrollmentRoutes.js
import express from "express";
import * as controller from "../controllers/enrollmentController.js";

const router = express.Router();

router.post("/", controller.createEnrollment);
router.get("/", controller.getAllEnrollments);
router.get("/:id", controller.getEnrollmentById);
router.put("/:id", controller.updateEnrollment);
router.delete("/:id", controller.deleteEnrollment);

export default router;