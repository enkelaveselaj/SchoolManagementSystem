import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors())

app.use(express.json());

// Run migrations on startup
const runMigrations = async () => {
  try {
    console.log("Running database migrations...");

    const columnsToAdd = [
      { name: 'password_reset_token', def: 'VARCHAR(255) UNIQUE NULL' },
      { name: 'password_reset_token_expires', def: 'DATETIME NULL' },
      { name: 'email_verification_token', def: 'VARCHAR(255) UNIQUE NULL' },
      { name: 'email_verification_token_expires', def: 'DATETIME NULL' },
      { name: 'email_verified', def: 'TINYINT DEFAULT 0' }
    ];

    for (const col of columnsToAdd) {
      try {
        await db.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.def}`);
        console.log(`✓ Added ${col.name} column`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`✓ ${col.name} column already exists`);
        } else {
          throw error;
        }
      }
    }

    console.log("✓ All migrations completed");
  } catch (error) {
    console.error("Migration error:", error.message);
  }
};

runMigrations();

app.use("/auth", authRoute);
app.use("/admin", adminRoute);

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({
      message: "DB Connected ✅",
      rows
    });
  } catch (err) {
    res.status(500).json({
      message: "DB Connection Failed ❌",
      error: err.message
    });
  }
});

app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted ✅",
    user: req.user
  });
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Auth service running on port ${process.env.PORT}`);
});