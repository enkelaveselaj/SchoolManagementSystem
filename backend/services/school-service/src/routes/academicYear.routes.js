const express = require("express");
const router = express.Router();
const academicYearController = require("../controllers/academicYear.controller");

// GET /academic-years - Get all academic years
router.get("/", academicYearController.getAllAcademicYears);

// GET /academic-years/current - Get current academic year
router.get("/current", academicYearController.getCurrentAcademicYear);

// GET /academic-years/:id - Get academic year by ID
router.get("/:id", academicYearController.getAcademicYearById);

// POST /academic-years - Create new academic year
router.post("/", academicYearController.createAcademicYear);

// PUT /academic-years/:id - Update academic year
router.put("/:id", academicYearController.updateAcademicYear);

// PUT /academic-years/:id/set-current - Set academic year as current
router.put("/:id/set-current", academicYearController.setCurrentAcademicYear);

// DELETE /academic-years/:id - Delete academic year
router.delete("/:id", academicYearController.deleteAcademicYear);

module.exports = router;
