const { Grade } = require("../src/models");
const authServiceClient = require("../services/authServiceClient");

class GradeRepository {
  async create(data) {
    // Validate student and teacher IDs with auth-service
    await authServiceClient.validateUser(data.studentId, 'Student');
    await authServiceClient.validateUser(data.teacherId, 'Teacher');
    
    return Grade.create(data);
  }

  async findAll() {
    return Grade.findAll();
  }

  async findByStudentAndSubject(studentId, subjectId) {
    // Validate student ID with auth-service
    await authServiceClient.validateUser(studentId, 'Student');
    
    return Grade.findOne({
      where: { studentId, subjectId },
    });
  }

  async updateByStudentAndSubject(studentId, subjectId, data) {
    // Validate student ID with auth-service
    await authServiceClient.validateUser(studentId, 'Student');
    
    // If updating teacherId, validate it
    if (data.teacherId) {
      await authServiceClient.validateUser(data.teacherId, 'Teacher');
    }
    
    return Grade.update(data, {
      where: { studentId, subjectId },
    });
  }

  async getGradesWithUserDetails(filters = {}) {
    const grades = await Grade.findAll({
      where: filters,
    });

    // Enrich with user details from auth-service
    const enrichedGrades = await Promise.all(
      grades.map(async (grade) => {
        const [student, teacher] = await Promise.all([
          authServiceClient.getUserById(grade.studentId),
          authServiceClient.getUserById(grade.teacherId),
        ]);

        return {
          ...grade.toJSON(),
          student,
          teacher,
        };
      })
    );

    return enrichedGrades;
  }

  async findById(id) {
    return Grade.findByPk(id);
  }

  async update(id, data) {
    // If updating studentId or teacherId, validate them
    if (data.studentId) {
      await authServiceClient.validateUser(data.studentId, 'Student');
    }
    if (data.teacherId) {
      await authServiceClient.validateUser(data.teacherId, 'Teacher');
    }
    
    return Grade.update(data, { where: { id } });
  }

  async delete(id) {
    return Grade.destroy({ where: { id } });
  }
}

module.exports = new GradeRepository();
