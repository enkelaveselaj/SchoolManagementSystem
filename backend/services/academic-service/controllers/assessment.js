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
  const { studentId, subjectId, teacherId } = req.body;

  const result = await assessmentService.deleteAssessment(
    req.params.id,
    studentId,
    subjectId,
    teacherId
  );

  res.json(result);
};