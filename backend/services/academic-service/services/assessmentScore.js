const assessmentScoreRepo = require("../repositories/assessmentScore");
const authServiceClient = require("./authServiceClient");
const notificationService = require("./notificationService");
const { Assessment } = require("../src/models");

class AssessmentScoreService {
  async createAssessmentScore(data) {
    try {
      // Validate that score doesn't exceed max score
      const assessment = await Assessment.findByPk(data.assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      if (data.score > assessment.maxScore) {
        throw new Error(`Score cannot exceed maximum score of ${assessment.maxScore}`);
      }
      
      const scoreRecord = await assessmentScoreRepo.create({
        ...data,
        gradedAt: new Date()
      });

      const fullScoreRecord = await assessmentScoreRepo.findById(scoreRecord.id);

      try {
        const student = await authServiceClient.getUserById(data.studentId);
        await notificationService.notifyStudentAssessmentScored(
          student.email,
          assessment.name || assessment.title || `Assessment ${data.assessmentId}`,
          data.score,
          assessment.maxScore
        );
      } catch (notifyError) {
        console.warn('Failed to send assessment score notification on create:', notifyError.message);
      }

      return fullScoreRecord;
    } catch (error) {
      throw error;
    }
  }

  async getAllAssessmentScores() {
    return assessmentScoreRepo.findAll();
  }

  async getAssessmentScoreById(id) {
    return assessmentScoreRepo.findById(id);
  }

  async getScoresByAssessment(assessmentId) {
    return assessmentScoreRepo.findByAssessment(assessmentId);
  }

  async getScoresByStudent(studentId) {
    return assessmentScoreRepo.findByStudent(studentId);
  }

  async getScoresByStudentAndSubject(studentId, subjectId) {
    return assessmentScoreRepo.findByStudentAndSubject(studentId, subjectId);
  }

  async upsertAssessmentScoreByAssessmentAndStudent(assessmentId, studentId, data) {
    try {
      const assessment = await Assessment.findByPk(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      if (data.score > assessment.maxScore) {
        throw new Error(`Score cannot exceed maximum score of ${assessment.maxScore}`);
      }

      let scoreRecord = await assessmentScoreRepo.findByAssessmentAndStudent(assessmentId, studentId);
      if (scoreRecord) {
        await assessmentScoreRepo.update(scoreRecord.id, {
          ...data,
          gradedAt: new Date()
        });
      } else {
        scoreRecord = await assessmentScoreRepo.create({
          assessmentId,
          studentId,
          score: data.score,
          remarks: data.remarks,
          gradedAt: new Date()
        });
      }

      const updatedScore = await assessmentScoreRepo.findById(scoreRecord.id);

      try {
        const student = await authServiceClient.getUserById(studentId);
        await notificationService.notifyStudentAssessmentScored(
          student.email,
          assessment.name || assessment.title || `Assessment ${assessmentId}`,
          updatedScore.score,
          assessment.maxScore
        );
      } catch (notifyError) {
        console.warn('Failed to send assessment score notification on assessment/student upsert:', notifyError.message);
      }

      return updatedScore;
    } catch (error) {
      throw error;
    }
  }

  async updateAssessmentScore(id, data) {
    try {
      // Validate that score doesn't exceed max score
      const existingScore = await assessmentScoreRepo.findById(id);
      if (!existingScore) {
        throw new Error('Existing assessment score not found');
      }

      if (data.score > existingScore.assessment.maxScore) {
        throw new Error(`Score cannot exceed maximum score of ${existingScore.assessment.maxScore}`);
      }
      
      await assessmentScoreRepo.update(id, {
        ...data,
        gradedAt: new Date()
      });

      const updatedScore = await assessmentScoreRepo.findById(id);

      try {
        const student = await authServiceClient.getUserById(updatedScore.studentId);
        await notificationService.notifyStudentAssessmentScored(
          student.email,
          updatedScore.assessment.name || updatedScore.assessment.title || `Assessment ${updatedScore.assessmentId}`,
          updatedScore.score,
          updatedScore.assessment.maxScore
        );
      } catch (notifyError) {
        console.warn('Failed to send assessment score notification on update:', notifyError.message);
      }

      return updatedScore;
    } catch (error) {
      throw error;
    }
  }

  async deleteAssessmentScore(id) {
    return assessmentScoreRepo.delete(id);
  }

  async calculateStudentGrade(studentId, subjectId) {
    try {
      const averageScore = await assessmentScoreRepo.calculateAverageScore(studentId, subjectId);
      
      // Grade calculation logic
      let grade = 'F';
      let gradeValue = 0;
      
      if (averageScore >= 90) {
        grade = 'A';
        gradeValue = 4.0;
      } else if (averageScore >= 80) {
        grade = 'B';
        gradeValue = 3.0;
      } else if (averageScore >= 70) {
        grade = 'C';
        gradeValue = 2.0;
      } else if (averageScore >= 60) {
        grade = 'D';
        gradeValue = 1.0;
      } else {
        grade = 'F';
        gradeValue = 0.0;
      }
      
      return {
        studentId,
        subjectId,
        averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
        grade,
        gradeValue
      };
    } catch (error) {
      throw error;
    }
  }

  async batchCreateScores(assessmentId, scores) {
    try {
      const results = [];
      const { Assessment } = require("../src/models");
      const assessment = await Assessment.findByPk(assessmentId);
      
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      for (const scoreData of scores) {
        // Validate score doesn't exceed max score
        if (scoreData.score > assessment.maxScore) {
          throw new Error(`Score cannot exceed maximum score of ${assessment.maxScore}`);
        }
        
        const result = await assessmentScoreRepo.create({
          assessmentId,
          studentId: scoreData.studentId,
          score: scoreData.score,
          remarks: scoreData.remarks,
          gradedAt: new Date()
        });
        results.push(result);

        try {
          const student = await authServiceClient.getUserById(scoreData.studentId);
          await notificationService.notifyStudentAssessmentScored(
            student.email,
            assessment.name || assessment.title || `Assessment ${assessmentId}`,
            scoreData.score,
            assessment.maxScore
          );
        } catch (notifyError) {
          console.warn('Failed to send assessment score notification in batch create:', notifyError.message);
        }
      }
      
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AssessmentScoreService();
