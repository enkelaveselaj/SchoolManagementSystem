// src/models/index.js
import sequelize from "../config/db.js"; // your Sequelize instance
import { DataTypes } from "sequelize";

// Import model definitions
import StudentModel from "./student.js";
import TeacherModel from "./teacher.js"; // Fixed case sensitivity
import EnrollmentModel from "./enrollment.js";
// Removed TeacherAssignmentModel to fix creation issues

// Initialize models
const Student = StudentModel(sequelize, DataTypes);
const Teacher = TeacherModel(sequelize, DataTypes);
const Enrollment = EnrollmentModel(sequelize, DataTypes);
// TeacherAssignment removed

// Define associations

// Student → Enrollment
Student.hasMany(Enrollment, {
  foreignKey: "studentId",
});
Enrollment.belongsTo(Student, {
  foreignKey: "studentId",
});

// Teacher → TeacherAssignment (removed completely)
// No TeacherAssignment associations

// Export all models and sequelize instance as a default export
const db = {
  sequelize,
  Student,
  Teacher,
  Enrollment,
  // TeacherAssignment removed
};

export default db;