const assessmentRepo = require("../repositories/assessment");
const gradeService = require("./grade");

class AssessmentService {
  async createAssessment(data) {
    const assessment = await assessmentRepo.create(data);

    // 🔥 AUTO RECALCULATE GRADE
    await gradeService.calculateFinalGrade(
      data.studentId,
      data.subjectId,
      data.teacherId
    );

    return assessment;
  }

  async getAllAssessments() {
    return assessmentRepo.findAll();
  }

  async updateAssessment(id, data) {
    await assessmentRepo.update(id, data);

    // 🔥 AUTO RECALCULATE AFTER UPDATE
    await gradeService.calculateFinalGrade(
      data.studentId,
      data.subjectId,
      data.teacherId
    );

    return { message: "Assessment updated" };
  }

  async deleteAssessment(id, studentId, subjectId, teacherId) {
    await assessmentRepo.delete(id);

    // 🔥 AUTO RECALCULATE AFTER DELETE
    await gradeService.calculateFinalGrade(
      studentId,
      subjectId,
      teacherId
    );

    return { message: "Assessment deleted" };
  }
}

module.exports = new AssessmentService();