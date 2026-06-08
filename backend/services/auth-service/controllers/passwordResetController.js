import crypto from "crypto";
import bcrypt from "bcrypt";
import { findUserByEmail, updateUser, findUserById } from "../repositories/userRepository.js";
import db from "../db.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const users = await findUserByEmail(email);

    if (users.length === 0) {
      return res.status(200).json({
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    const user = users[0];

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      "UPDATE users SET password_reset_token = ?, password_reset_token_expires = ? WHERE id = ?",
      [hashedToken, tokenExpiry, user.id]
    );

    console.log("========== PASSWORD RESET EMAIL (DEV MODE) ==========");
    console.log(`To: ${user.email}`);
    console.log(`Reset Link: http://localhost:5001/auth/reset-password/${resetToken}`);
    console.log(`Token expires in 15 minutes`);
    console.log("=====================================================");

    res.status(200).json({
      message: "If an account exists with this email, a reset link has been sent.",
      ...(process.env.NODE_ENV === "development" && {
        dev_reset_token: resetToken,
        dev_expires_in_minutes: 15,
      }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Reset token is required" });
    }

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [users] = await db.query(
      "SELECT * FROM users WHERE password_reset_token = ? AND password_reset_token_expires > NOW()",
      [hashedToken]
    );

    if (users.length === 0) {
      return res.status(400).json({
        error: "Invalid or expired reset token",
      });
    }

    const user = users[0];

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_token_expires = NULL WHERE id = ?",
      [passwordHash, user.id]
    );

    res.status(200).json({
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [users] = await db.query(
      "SELECT * FROM users WHERE email_verification_token = ? AND email_verification_token_expires > NOW()",
      [hashedToken]
    );

    if (users.length === 0) {
      return res.status(400).json({
        error: "Invalid or expired verification token",
      });
    }

    const user = users[0];

    await db.query(
      "UPDATE users SET email_verified = 1, email_verification_token = NULL, email_verification_token_expires = NULL WHERE id = ?",
      [user.id]
    );

    res.status(200).json({
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


