const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ override: true });

// Initialize models and associations
const db = require('./models');

const schoolRoutes = require("./routes/school.routes");
const academicYearRoutes = require("./routes/academicYear.routes");
const classRoutes = require("./routes/class.routes");
const sectionRoutes = require("./routes/section.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/school", schoolRoutes);
app.use("/academic-years", academicYearRoutes);
app.use("/classes", classRoutes);
app.use("/sections", sectionRoutes);

app.get("/health", (req, res) => res.send("School service is running"));

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();

    const existingSchool = await db.School.findOne();
    if (!existingSchool) {
      await db.School.create({
        name: process.env.DEFAULT_SCHOOL_NAME || "Blue Ridge Academy",
        address: process.env.DEFAULT_SCHOOL_ADDRESS || "1234 Academy Drive",
      });
    }

    app.listen(PORT, () => console.log(`School service running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start School service:", err);
    process.exit(1);
  }
};

startServer();