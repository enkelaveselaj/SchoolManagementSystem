import express from "express";
import { register } from "../controllers/authController.js";
import { login } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;