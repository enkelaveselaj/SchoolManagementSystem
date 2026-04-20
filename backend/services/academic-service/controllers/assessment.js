const assessmentService = require("../services/assessment");

exports.create = async (req, res) => {
  const data = await assessmentService.createAssessment(req.body);
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await assessmentService.getAllAssessments();
  res.json(data);
};

exports.update = async (req, res) => {
  const result = await assessmentService.updateAssessment(
    req.params.id,
    req.body
  );
  res.json(result);
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