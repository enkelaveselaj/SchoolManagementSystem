const assessmentScoreRepo = require("../repositories/assessmentScore");
const authServiceClient = require("./authServiceClient");
const notificationService = require("./notificationService");

class AssessmentScoreService {
  async createAssessmentScore(data) {
    try {
      const models = require("../src/models");
      const assessmentId = parseInt(data.assessmentId);

      const assessment = await models.Assessment.findByPk(assessmentId);
      if (!assessment) {
        throw new Error(`Assessment with ID ${assessmentId} not found`);
      }

      const score = parseFloat(data.score);
      if (score > assessment.maxScore) {
        throw new Error(`Score ${score} cannot exceed maximum score of ${assessment.maxScore}`);
      }
      
      let scoreRecord = await assessmentScoreRepo.findByAssessmentAndStudent(assessmentId, data.studentId);

      if (scoreRecord) {
          await assessmentScoreRepo.update(scoreRecord.id, {
              score: score,
              remarks: data.remarks,
              gradedAt: new Date()
          });
          scoreRecord = await assessmentScoreRepo.findById(scoreRecord.id);
      } else {
          scoreRecord = await assessmentScoreRepo.create({
            ...data,
            assessmentId,
            score,
            gradedAt: new Date()
          });
      }

      try {
        const student = await authServiceClient.getUserById(data.studentId);
        await notificationService.notifyStudentAssessmentScored(
          student.email,
          assessment.title || `Assessment ${assessmentId}`,
          score,
          assessment.maxScore
        );
      } catch (notifyError) {
        console.warn('Notification failed:', notifyError.message);
      }

      return scoreRecord;
    } catch (error) {
      console.error('Error in createAssessmentScore:', error);
      throw error;
    }
  }

  async batchCreateScores(assessmentId, scores) {
    try {
      const models = require("../src/models");
      const id = parseInt(assessmentId);
      const assessment = await models.Assessment.findByPk(id);

      if (!assessment) {
        throw new Error(`Assessment not found (ID: ${assessmentId})`);
      }

      const results = [];
      for (const scoreData of scores) {
        if (parseFloat(scoreData.score) > assessment.maxScore) continue;

        const result = await this.createAssessmentScore({
            assessmentId: id,
            studentId: parseInt(scoreData.studentId),
            score: scoreData.score,
            remarks: scoreData.remarks
        });
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Batch save error:', error);
      throw error;
    }
  }

  async getAllAssessmentScores() {
    return assessmentScoreRepo.findAll();
  }

  async getScoresByAssessment(assessmentId) {
    return assessmentScoreRepo.findByAssessment(parseInt(assessmentId));
  }

  async getScoresByStudent(studentId) {
    return assessmentScoreRepo.findByStudent(parseInt(studentId));
  }

  async getScoresByStudentAndSubject(studentId, subjectId) {
    return assessmentScoreRepo.findByStudentAndSubject(parseInt(studentId), parseInt(subjectId));
  }

  async calculateStudentGrade(studentId, subjectId) {
    try {
      const averageScore = await assessmentScoreRepo.calculateAverageScore(parseInt(studentId), parseInt(subjectId));
      
      let grade = 'F';
      if (averageScore >= 90) grade = 'A';
      else if (averageScore >= 80) grade = 'B';
      else if (averageScore >= 70) grade = 'C';
      else if (averageScore >= 60) grade = 'D';
      
      return {
        studentId: parseInt(studentId),
        subjectId: parseInt(subjectId),
        averageScore: Math.round(averageScore * 100) / 100,
        grade
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AssessmentScoreService();
