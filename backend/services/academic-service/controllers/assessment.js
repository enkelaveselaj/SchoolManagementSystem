const assessmentService = require("../services/assessment");
const assessmentScoreService = require("../services/assessmentScore");
const authServiceClient = require("../services/authServiceClient");

exports.create = async (req, res) => {
  try {
    const data = await assessmentService.createAssessment(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create assessment' });
  }
};

exports.createWithScores = async (req, res) => {
  try {
    const { assessment, scores } = req.body;
    const createdAssessment = await assessmentService.createAssessment(assessment);
    
    if (scores && scores.length > 0) {
      const scoresWithAssessmentId = scores.map(score => ({
        ...score,
        assessmentId: createdAssessment.id
      }));
      await assessmentScoreService.bulkCreateScores(scoresWithAssessmentId);
    }
    
    res.json(createdAssessment);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create assessment with scores' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { studentId: userId } = req.query; // This might be a UserId or StudentId
    const data = await assessmentService.getAllAssessments();

    if (userId) {
        // Resolve UserId to domain StudentId
        const studentId = await authServiceClient.getStudentIdByUserId(userId);

        // Enrich assessments with this student's specific scores
        const studentScores = await assessmentScoreService.getScoresByStudent(studentId);
        const scoreMap = {};
        studentScores.forEach(s => scoreMap[s.assessmentId] = s);

        const enrichedData = data.map(assessment => {
            const assessmentJson = assessment.toJSON ? assessment.toJSON() : assessment;
            return {
                ...assessmentJson,
                myScore: scoreMap[assessment.id] || null
            };
        });
        return res.json(enrichedData);
    }

    res.json(data);
  } catch (error) {
    console.error('Error in assessment.getAll:', error);
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
    const result = await assessmentService.updateAssessment(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await assessmentService.deleteAssessment(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
};

exports.updateStudentAssessmentScore = async (req, res) => {
  try {
    const { assessmentId, studentId } = req.params;
    const { score } = req.body;
    const result = await assessmentScoreService.updateScore(assessmentId, studentId, score);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update assessment score' });
  }
};
