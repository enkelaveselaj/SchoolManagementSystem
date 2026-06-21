const gradeRepo = require("../repositories/grade");
const assessmentRepo = require("../repositories/assessment");
const notificationService = require("./notificationService");
const authServiceClient = require("./authServiceClient");
const { Grade, Subject } = require("../src/models");

class GradeService {
  async createGrade(data) {
    const grade = await gradeRepo.create(data);

    try {
      const student = await authServiceClient.getUserById(data.studentId);
      await notificationService.notifyStudentGradePosted(
        student.email,
        `Subject ${data.subjectId}`,
        grade.value
      );
    } catch (err) {
      console.warn('Failed to send grade notification on create:', err.message);
    }

    return grade;
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

  async getGrades(studentId = null) {
    const where = {};
    if (studentId) where.studentId = studentId;

    // Use models directly to include subjects
    return Grade.findAll({
      where,
      include: [{ model: Subject, as: 'subject' }]
    });
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
