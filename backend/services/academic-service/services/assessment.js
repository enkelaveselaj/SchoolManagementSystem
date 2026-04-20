const assessmentRepo = require("../repositories/assessment");
const gradeService = require("./grade");

class AssessmentService {
  async createAssessment(data) {
    const assessment = await assessmentRepo.create(data);

    // Note: Grade calculation will be done when individual student scores are added
    // since assessments are now class-based, not student-based

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

  async deleteAssessment(id) {
    await assessmentRepo.delete(id);
    return { message: "Assessment deleted" };
  }
}

module.exports = new AssessmentService();