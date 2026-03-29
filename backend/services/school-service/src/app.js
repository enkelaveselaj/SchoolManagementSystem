const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const schoolRoutes = require("./routes/school.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/school", schoolRoutes);

app.get("/health", (req, res) => res.send("School service is running"));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`School service running on port ${PORT}`));