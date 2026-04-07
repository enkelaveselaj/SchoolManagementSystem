import express from "express";
import cors from "cors";

import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import assignmentRoutes from "./routes/teacherAssignmentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/assignments", assignmentRoutes);

export default app;