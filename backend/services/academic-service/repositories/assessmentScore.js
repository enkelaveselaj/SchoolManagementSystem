const { AssessmentScore, Assessment, Subject } = require("../src/models");

class AssessmentScoreRepository {
  async create(data) {
    return AssessmentScore.create({
        ...data,
        assessmentId: parseInt(data.assessmentId),
        studentId: parseInt(data.studentId),
        score: parseFloat(data.score)
    });
  }

  async findAll() {
    return AssessmentScore.findAll({
      include: [{ model: Assessment, as: 'assessment', include: [{ model: Subject, as: 'subject' }] }]
    });
  }

  async findById(id) {
    return AssessmentScore.findByPk(parseInt(id), {
      include: [{ model: Assessment, as: 'assessment', include: [{ model: Subject, as: 'subject' }] }]
    });
  }

  async findByAssessment(assessmentId) {
    return AssessmentScore.findAll({
      where: { assessmentId: parseInt(assessmentId) },
      include: [{ model: Assessment, as: 'assessment' }]
    });
  }

  async findByStudent(studentId) {
    return AssessmentScore.findAll({
      where: { studentId: parseInt(studentId) },
      include: [{ model: Assessment, as: 'assessment', include: [{ model: Subject, as: 'subject' }] }]
    });
  }

  async findByStudentAndSubject(studentId, subjectId) {
    return AssessmentScore.findAll({
      where: { studentId: parseInt(studentId) },
      include: [
        {
          model: Assessment,
          as: 'assessment',
          where: { subjectId: parseInt(subjectId) },
          include: [{ model: Subject, as: 'subject' }]
        }
      ]
    });
  }

  async findByAssessmentAndStudent(assessmentId, studentId) {
    return AssessmentScore.findOne({
      where: {
          assessmentId: parseInt(assessmentId),
          studentId: parseInt(studentId)
      }
    });
  }

  async update(id, data) {
    return AssessmentScore.update(data, { where: { id: parseInt(id) } });
  }

  async delete(id) {
    return AssessmentScore.destroy({ where: { id: parseInt(id) } });
  }

  async calculateAverageScore(studentId, subjectId) {
    const scores = await this.findByStudentAndSubject(studentId, subjectId);
    if (scores.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    for (const score of scores) {
        if (score.assessment) {
            totalScore += (parseFloat(score.score) / parseFloat(score.assessment.maxScore)) * parseFloat(score.assessment.weight);
            totalWeight += parseFloat(score.assessment.weight);
        }
    }
    
    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  }
}

module.exports = new AssessmentScoreRepository();
