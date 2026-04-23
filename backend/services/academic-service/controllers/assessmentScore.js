const assessmentScoreService = require("../services/assessmentScore");

class AssessmentScoreController {
  async create(req, res) {
    try {
      const score = await assessmentScoreService.createAssessmentScore(req.body);
      res.status(201).json(score);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const scores = await assessmentScoreService.getAllAssessmentScores();
      res.json(scores);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const score = await assessmentScoreService.getAssessmentScoreById(req.params.id);
      if (!score) return res.status(404).json({ message: "Not found" });
      res.json(score);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByAssessment(req, res) {
    try {
      const scores = await assessmentScoreService.getScoresByAssessment(req.params.assessmentId);
      res.json(scores);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByStudent(req, res) {
    try {
      const scores = await assessmentScoreService.getScoresByStudent(req.params.studentId);
      res.json(scores);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByStudentAndSubject(req, res) {
    try {
      const scores = await assessmentScoreService.getScoresByStudentAndSubject(
        req.params.studentId, 
        req.params.subjectId
      );
      res.json(scores);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      await assessmentScoreService.updateAssessmentScore(req.params.id, req.body);
      res.json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await assessmentScoreService.deleteAssessmentScore(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async calculateGrade(req, res) {
    try {
      const grade = await assessmentScoreService.calculateStudentGrade(
        req.params.studentId,
        req.params.subjectId
      );
      res.json(grade);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async batchCreate(req, res) {
    try {
      const { assessmentId, scores } = req.body;
      const results = await assessmentScoreService.batchCreateScores(assessmentId, scores);
      res.status(201).json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AssessmentScoreController();
