const assessmentRepo = require("../repositories/assessment");
const gradeService = require("./grade");
const notificationService = require("./notificationService");
const authServiceClient = require("./authServiceClient");
const assessmentScoreService = require("./assessmentScore");

class AssessmentService {
  async createAssessment(data) {
    const assessment = await assessmentRepo.create(data);

    // Note: Grade calculation will be done when individual student scores are added
    // since assessments are now class-based, not student-based

    // Send notifications to all students
    try {
      const students = await authServiceClient.getStudents();
      const dueDate = data.dueDate ? new Date(data.dueDate).toLocaleDateString() : 'TBD';
      for (const student of students) {
        await notificationService.notifyStudentAssessmentCreated(student.email, data.name || 'New Assessment', dueDate);
      }
    } catch (err) {
      console.warn('Failed to send assessment notifications:', err.message);
    }

    return assessment;
  }

  async getAllAssessments() {
    return assessmentRepo.findAll();
  }

  async updateAssessment(id, data) {
    await assessmentRepo.update(id, data);

    // Note: Grade calculation will be done when individual student scores are updated
    // since assessments are now class-based, not student-based

    return { message: "Assessment updated" };
  }

  async createAssessmentWithScores({ assessment, scores }) {
    const created = await assessmentRepo.create(assessment);
    const createdScores = [];

    for (const scoreData of scores || []) {
      const createdScore = await assessmentScoreService.createAssessmentScore({
        assessmentId: created.id,
        studentId: scoreData.studentId,
        score: scoreData.score,
        remarks: scoreData.remarks
      });
      createdScores.push(createdScore);
    }

    return {
      assessment: created,
      scores: createdScores
    };
  }

  async getAssessmentWithScores(id) {
    const assessmentWithScores = await assessmentRepo.findByIdWithScores(id);
    if (!assessmentWithScores) {
      throw new Error('Assessment not found');
    }
    return assessmentWithScores;
  }

  async updateStudentAssessmentScore(assessmentId, studentId, data) {
    return assessmentScoreService.upsertAssessmentScoreByAssessmentAndStudent(assessmentId, studentId, data);
  }

  async deleteAssessment(id) {
    await assessmentRepo.delete(id);
    return { message: "Assessment deleted" };
  }
}

module.exports = new AssessmentService();