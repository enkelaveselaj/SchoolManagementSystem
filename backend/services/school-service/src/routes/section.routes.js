const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/section.controller");

// GET /sections - Get all sections
router.get("/", sectionController.getAllSections);

// GET /sections/class/:classId - Get sections by class
router.get("/class/:classId", sectionController.getSectionsByClass);

// GET /sections/:id - Get section by ID
router.get("/:id", sectionController.getSectionById);

// GET /sections/:id/students - Get students in a section
router.get("/:id/students", sectionController.getStudentsInSection);

// GET /sections/:id/capacity - Get section capacity info
router.get("/:id/capacity", sectionController.getSectionCapacity);

// POST /sections - Create new section
router.post("/", sectionController.createSection);

// PUT /sections/:id - Update section
router.put("/:id", sectionController.updateSection);

// DELETE /sections/:id - Delete section
router.delete("/:id", sectionController.deleteSection);

module.exports = router;
