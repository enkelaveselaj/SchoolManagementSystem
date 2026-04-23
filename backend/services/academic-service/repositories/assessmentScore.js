const { AssessmentScore, Assessment } = require("../src/models");

class AssessmentScoreRepository {
  async create(data) {
    return AssessmentScore.create(data);
  }

  async findAll() {
    return AssessmentScore.findAll({
      include: [
        {
          model: Assessment,
          as: 'assessment'
        }
      ]
    });
  }

  async findById(id) {
    return AssessmentScore.findByPk(id, {
      include: [
        {
          model: Assessment,
          as: 'assessment'
        }
      ]
    });
  }

  async findByAssessment(assessmentId) {
    return AssessmentScore.findAll({
      where: { assessmentId },
      include: [
        {
          model: Assessment,
          as: 'assessment'
        }
      ]
    });
  }

  async findByStudent(studentId) {
    return AssessmentScore.findAll({
      where: { studentId },
      include: [
        {
          model: Assessment,
          as: 'assessment'
        }
      ]
    });
  }

  async findByStudentAndSubject(studentId, subjectId) {
    return AssessmentScore.findAll({
      where: { studentId },
      include: [
        {
          model: Assessment,
          as: 'assessment',
          where: { subjectId }
        }
      ]
    });
  }

  async update(id, data) {
    return AssessmentScore.update(data, { where: { id } });
  }

  async delete(id) {
    return AssessmentScore.destroy({ where: { id } });
  }

  async calculateAverageScore(studentId, subjectId) {
    const scores = await this.findByStudentAndSubject(studentId, subjectId);
    if (scores.length === 0) return 0;
    
    const totalScore = scores.reduce((sum, score) => {
      return sum + (score.score / score.assessment.maxScore) * score.assessment.weight;
    }, 0);
    
    const totalWeight = scores.reduce((sum, score) => sum + score.assessment.weight, 0);
    
    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  }
}

module.exports = new AssessmentScoreRepository();
