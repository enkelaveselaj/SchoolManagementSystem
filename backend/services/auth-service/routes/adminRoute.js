import express from "express";
import { createUserController } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { linkParentStudentController } from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-user", verifyToken, createUserController);
router.post("/link-parent-student", verifyToken, linkParentStudentController);

export default router;