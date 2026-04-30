import express from "express";
import { createUserController, getParentsController, linkParentStudentController, assignParentStudentsController } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-user", verifyToken, createUserController);
router.post("/link-parent-student", verifyToken, linkParentStudentController);
router.get("/parents", verifyToken, getParentsController);
router.post("/parents/:parentId/assign", verifyToken, assignParentStudentsController);

export default router;