import express from "express";
import * as adminController from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getAllUsersByRole } from "../services/adminService.js";

const router = express.Router();

router.post("/create-user", verifyToken, adminController.createUserController);
router.post("/create-teacher", verifyToken, adminController.createTeacherController);
router.post("/link-parent-student", verifyToken, adminController.linkParentStudentController);
router.get("/parents", verifyToken, adminController.getParentsController);
router.post("/parents/:parentId/assign", verifyToken, adminController.assignParentStudentsController);
router.get("/parents/me/children", verifyToken, adminController.getParentChildrenController);

router.get("/sync", verifyToken, async (req, res) => {
    try {
        const { role } = req.query;
        const users = await getAllUsersByRole(role);
        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// User Management
router.put("/users/:userId", verifyToken, adminController.updateUserController);
router.delete("/users/:userId", verifyToken, adminController.deleteUserController);

export default router;
