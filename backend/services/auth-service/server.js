import express from "express";
import dotenv from "dotenv";
import db from "./db.js";

import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(express.json());

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

app.listen(process.env.PORT, () => {
  console.log(`Auth service running on port ${process.env.PORT}`);
});