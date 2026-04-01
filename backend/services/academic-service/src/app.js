require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");

const subjectRoutes = require("../routes/subject");
const attendanceRoutes = require("../routes/attendance");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/subjects", subjectRoutes);
app.use("/attendance", attendanceRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Academic service running on port ${process.env.PORT}`);
  });
});