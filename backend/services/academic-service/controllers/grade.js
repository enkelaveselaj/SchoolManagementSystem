const gradeService = require("../services/grade");

exports.calculate = async (req, res) => {
  const { studentId, subjectId, teacherId } = req.body;

  const result = await gradeService.calculateFinalGrade(
    studentId,
    subjectId,
    teacherId
  );

  res.json(result);
};

exports.getAll = async (req, res) => {
  const grades = await gradeService.getGrades();
  res.json(grades);
};

exports.manualUpdate = async (req, res) => {
  const { studentId, subjectId, value } = req.body;

  const result = await gradeService.manualUpdate(
    studentId,
    subjectId,
    value
  );

  res.json(result);
};