const assessmentScoreRepo = require("../repositories/assessmentScore");

class AssessmentScoreService {
  async createAssessmentScore(data) {
    try {
      // Validate that score doesn't exceed max score
      const assessment = await assessmentScoreRepo.findById(data.assessmentId);
      if (data.score > assessment.assessment.maxScore) {
        throw new Error(`Score cannot exceed maximum score of ${assessment.assessment.maxScore}`);
      }
      
      return assessmentScoreRepo.create({
        ...data,
        gradedAt: new Date()
      });
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

  async updateAssessmentScore(id, data) {
    try {
      // Validate that score doesn't exceed max score
      const existingScore = await assessmentScoreRepo.findById(id);
      if (data.score > existingScore.assessment.maxScore) {
        throw new Error(`Score cannot exceed maximum score of ${existingScore.assessment.maxScore}`);
      }
      
      return assessmentScoreRepo.update(id, {
        ...data,
        gradedAt: new Date()
      });
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
      }
      
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AssessmentScoreService();
