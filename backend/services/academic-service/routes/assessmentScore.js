const express = require("express");
const router = express.Router();
const assessmentScoreController = require("../controllers/assessmentScore");

// CRUD routes
router.post("/", assessmentScoreController.create);
router.get("/", assessmentScoreController.getAll);

// Specific read routes
router.get("/assessment/:assessmentId", assessmentScoreController.getByAssessment);
router.get("/student/:studentId", assessmentScoreController.getByStudent);
router.get("/student/:studentId/subject/:subjectId", assessmentScoreController.getByStudentAndSubject);
router.get("/student/:studentId/subject/:subjectId/grade", assessmentScoreController.calculateGrade);
router.post("/batch", assessmentScoreController.batchCreate);

// By id routes
router.get("/:id", assessmentScoreController.getById);
router.put("/:id", assessmentScoreController.update);
router.delete("/:id", assessmentScoreController.delete);

module.exports = router;
