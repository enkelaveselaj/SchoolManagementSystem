// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // MUST be at the top

const sequelize = new Sequelize(
  process.env.DB_NAME,      // teacher_student_service
  process.env.DB_USER,      // root
  process.env.DB_PASSWORD,  // 26082004
  {
    host: process.env.DB_HOST, // localhost
    dialect: "mysql",
    logging: false,
  }
);

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

export default sequelize;