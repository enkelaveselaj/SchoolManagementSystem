const assessmentService = require("../services/assessment");

exports.create = async (req, res) => {
  try {
    const data = await assessmentService.createAssessment(req.body);
    res.json(data);
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ error: error.message || 'Failed to create assessment' });
  }
};

exports.createWithScores = async (req, res) => {
  try {
    const data = await assessmentService.createAssessmentWithScores(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await assessmentService.getAllAssessments();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWithScores = async (req, res) => {
  try {
    const data = await assessmentService.getAssessmentWithScores(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await assessmentService.updateAssessment(
      req.params.id,
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudentAssessmentScore = async (req, res) => {
  try {
    const score = await assessmentService.updateStudentAssessmentScore(
      req.params.assessmentId,
      req.params.studentId,
      req.body
    );
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await assessmentService.deleteAssessment(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
};
