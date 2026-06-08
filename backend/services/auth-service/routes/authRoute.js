import express from "express";
import { register } from "../controllers/authController.js";
import { login } from "../controllers/authController.js";
import {
  forgotPassword,
  resetPassword,
  verifyEmail
} from "../controllers/passwordResetController.js";

const router = express.Router();

// Authentication endpoints
router.post("/login", login);
router.post("/register", register);

// Password reset endpoints
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Email verification endpoint
router.post("/verify-email", verifyEmail);

export default router;