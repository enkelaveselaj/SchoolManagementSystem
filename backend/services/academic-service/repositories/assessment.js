const { Assessment } = require("../src/models");
const authServiceClient = require("../services/authServiceClient");

class AssessmentRepository {
  async create(data) {
    
    // Only validate teacher since assessments are now class-based, not student-based
    await authServiceClient.validateUser(data.teacherId, 'Teacher');
    
    return Assessment.create(data);
  }

  async findAll() {
    return Assessment.findAll();
  }

  async findById(id) {
    return Assessment.findByPk(id);
  }

  async findByStudentAndSubject(studentId, subjectId) {
    
    await authServiceClient.validateUser(studentId, 'Student');
    
    return Assessment.findAll({
      where: { studentId, subjectId },
    });
  }

  async update(id, data) {
    
    // Only validate teacher since assessments are now class-based, not student-based
    if (data.teacherId) {
      await authServiceClient.validateUser(data.teacherId, 'Teacher');
    }
    
    return Assessment.update(data, { where: { id } });
  }

  async delete(id) {
    return Assessment.destroy({ where: { id } });
  }

  async getAssessmentsWithUserDetails(filters = {}) {
    const assessments = await Assessment.findAll({
      where: filters,
    });

  
    const enrichedAssessments = await Promise.all(
      assessments.map(async (assessment) => {
        // Only get teacher details since assessments are now class-based, not student-based
        const teacher = await authServiceClient.getUserById(assessment.teacherId);

        return {
          ...assessment.toJSON(),
          teacher,
        };
      })
    );

    return enrichedAssessments;
  }
}

module.exports = new AssessmentRepository();