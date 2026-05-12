import express from "express";
import { createUserController, getParentsController, linkParentStudentController, assignParentStudentsController, createTeacherController, getParentChildrenController } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-user", verifyToken, createUserController);
router.post("/create-teacher", verifyToken, createTeacherController);
router.post("/link-parent-student", verifyToken, linkParentStudentController);
router.get("/parents", verifyToken, getParentsController);
router.post("/parents/:parentId/assign", verifyToken, assignParentStudentsController);
router.get("/parents/me/children", verifyToken, getParentChildrenController);

export default router;