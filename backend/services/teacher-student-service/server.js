import dotenv from "dotenv";
import app from "./src/app.js";
import db from "./src/models/index.js";

dotenv.config();

const PORT = process.env.PORT || 5004;

db.sequelize.sync().then(() => {
  console.log("Database synced");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});