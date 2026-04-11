const express = require("express");
const router = express.Router();
const classController = require("../controllers/class.controller");

// GET /classes - Get all classes
router.get("/", classController.getAllClasses);

// GET /classes/academic-year/:academicYearId - Get classes by academic year
router.get("/academic-year/:academicYearId", classController.getClassesByAcademicYear);

// GET /classes/grade/:gradeLevel - Get classes by grade level
router.get("/grade/:gradeLevel", classController.getClassesByGradeLevel);

// GET /classes/:id - Get class by ID
router.get("/:id", classController.getClassById);

// GET /classes/:id/students - Get students in a class
router.get("/:id/students", classController.getStudentsInClass);

// POST /classes - Create new class
router.post("/", classController.createClass);

// PUT /classes/:id - Update class
router.put("/:id", classController.updateClass);

// DELETE /classes/:id - Delete class
router.delete("/:id", classController.deleteClass);

module.exports = router;
