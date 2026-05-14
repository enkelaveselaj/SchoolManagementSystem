const express = require("express");
const router = express.Router();
const controller = require("../controllers/assessment");

router.post("/", controller.create);
router.post("/with-scores", controller.createWithScores);
router.get("/", controller.getAll);
router.get("/:id/with-scores", controller.getWithScores);
router.put("/:id", controller.update);
router.put("/:assessmentId/scores/:studentId", controller.updateStudentAssessmentScore);
router.delete("/:id", controller.delete);

module.exports = router;