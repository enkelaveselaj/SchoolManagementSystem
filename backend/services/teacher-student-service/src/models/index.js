// src/models/index.js
import sequelize from "../config/db.js"; // your Sequelize instance
import { DataTypes } from "sequelize";

// Import model definitions
import StudentModel from "./student.js";
import TeacherModel from "./teacher.js";
import EnrollmentModel from "./enrollment.js";
import TeacherAssignmentModel from "./teacherAssignment.js";

// Initialize models
const Student = StudentModel(sequelize, DataTypes);
const Teacher = TeacherModel(sequelize, DataTypes);
const Enrollment = EnrollmentModel(sequelize, DataTypes);
const TeacherAssignment = TeacherAssignmentModel(sequelize, DataTypes);

// Define associations

// Student → Enrollment
Student.hasMany(Enrollment, {
  foreignKey: "studentId",
});
Enrollment.belongsTo(Student, {
  foreignKey: "studentId",
});

// Teacher → TeacherAssignment
Teacher.hasMany(TeacherAssignment, {
  foreignKey: "teacherId",
});
TeacherAssignment.belongsTo(Teacher, {
  foreignKey: "teacherId",
});

// Export all models and sequelize instance as a default export
const db = {
  sequelize,
  Student,
  Teacher,
  Enrollment,
  TeacherAssignment,
};

export default db;