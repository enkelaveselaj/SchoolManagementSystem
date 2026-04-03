const { Assessment } = require("../src/models");
const authServiceClient = require("../services/authServiceClient");

class AssessmentRepository {
  async create(data) {
    
    await authServiceClient.validateUser(data.studentId, 'Student');
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
    
    if (data.studentId) {
      await authServiceClient.validateUser(data.studentId, 'Student');
    }
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
        const [student, teacher] = await Promise.all([
          authServiceClient.getUserById(assessment.studentId),
          authServiceClient.getUserById(assessment.teacherId),
        ]);

        return {
          ...assessment.toJSON(),
          student,
          teacher,
        };
      })
    );

    return enrichedAssessments;
  }
}

module.exports = new AssessmentRepository();