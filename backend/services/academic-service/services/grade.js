const gradeRepo = require("../repositories/grade");
const assessmentRepo = require("../repositories/assessment");

class GradeService {
  async createGrade(data) {
    return gradeRepo.create(data);
  }

  async calculateFinalGrade(studentId, subjectId, teacherId) {
    const assessments = await assessmentRepo.findByStudentAndSubject(
      studentId,
      subjectId
    );

    if (!assessments.length) {
      throw new Error("No assessments found");
    }

    let total = 0;
    let totalWeight = 0;

    assessments.forEach((a) => {
      const normalized = a.score / a.maxScore;
      total += normalized * a.weight;
      totalWeight += a.weight;
    });

    if (totalWeight === 0) {
      throw new Error("Invalid weights");
    }

    const finalValue = (total / totalWeight) * 10;

    const existing = await gradeRepo.findByStudentAndSubject(
      studentId,
      subjectId
    );

    if (existing) {
      await gradeRepo.updateByStudentAndSubject(studentId, subjectId, {
        value: finalValue,
        teacherId,
        finalizedAt: new Date(),
      });

      return { message: "Grade updated", value: finalValue };
    } else {
      return gradeRepo.create({
        studentId,
        subjectId,
        teacherId,
        value: finalValue,
        finalizedAt: new Date(),
      });
    }
  }

  async getGrades() {
    return gradeRepo.findAll();
  }

  async manualUpdate(studentId, subjectId, value) {
    const existing = await gradeRepo.findByStudentAndSubject(
      studentId,
      subjectId
    );

    if (!existing) throw new Error("Grade not found");

    return gradeRepo.updateByStudentAndSubject(studentId, subjectId, {
      value,
      finalizedAt: new Date(),
    });
  }
}

module.exports = new GradeService();