require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");

const subjectRoutes = require("../routes/subject");
const attendanceRoutes = require("../routes/attendance");
const timetableRoutes = require("../routes/timetable");
const assessmentRoutes = require("../routes/assessment");
const gradeRoutes = require("../routes/grade");
const assessmentScoreRoutes = require("../routes/assessmentScore");
const announcementRoutes = require("../routes/announcements");
const dashboardRoutes = require("../routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/subjects", subjectRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/timetable", timetableRoutes);
app.use("/assessments", assessmentRoutes );
app.use("/grades", gradeRoutes);
app.use("/assessment-scores", assessmentScoreRoutes);
app.use("/announcements", announcementRoutes);
app.use("/api/dashboard", dashboardRoutes);

const startServer = () => {
    app.listen(process.env.PORT, () => {
        console.log(`Academic service running on port ${process.env.PORT} ✅`);
    });
};

// Database Sync with improved error recovery
sequelize.sync({ alter: true }).then(() => {
  console.log("Academic database synced successfully.");
  startServer();
}).catch(err => {
  console.error("Initial sync failed, attempting forced recovery...");
  // If alter fails (common when changing Primary Key types), force sync once
  sequelize.sync({ force: true }).then(() => {
      console.log("Database RECREATED to fix schema mismatch.");
      startServer();
  }).catch(fatal => {
      console.error("Fatal: Could not start database:", fatal);
  });
});
