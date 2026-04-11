const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Initialize models and associations
require('./models');

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
app.listen(PORT, () => console.log(`School service running on port ${PORT}`));