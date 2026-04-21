require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");

const subjectRoutes = require("../routes/subject");
const attendanceRoutes = require("../routes/attendance");
const timetableRoutes = require("../routes/timetable");
const assessmentRoutes = require("../routes/assessment");
const gradeRoutes = require("../routes/grade");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/subjects", subjectRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/timetable", timetableRoutes);
app.use("/assessments", assessmentRoutes );
app.use("/grades", gradeRoutes);

const { Timetable } = require("./models");

sequelize.sync().then(() => {
  // Force sync Timetable model to create table if it doesn't exist
  return Timetable.sync({ force: false, alter: true });
}).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Academic service running on port ${process.env.PORT}`);
  });
});