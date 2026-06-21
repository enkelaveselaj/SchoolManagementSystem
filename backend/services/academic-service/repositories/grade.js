const { Grade, Subject } = require("../src/models");

class GradeRepository {
  async create(data) {
    return Grade.create({
        ...data,
        studentId: parseInt(data.studentId),
        subjectId: parseInt(data.subjectId),
        teacherId: parseInt(data.teacherId),
        value: parseFloat(data.value)
    });
  }

  async findAll() {
    return Grade.findAll({
        include: [{ model: Subject, as: 'subject' }]
    });
  }

  async findByStudentAndSubject(studentId, subjectId) {
    return Grade.findOne({
      where: {
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectId)
      },
      include: [{ model: Subject, as: 'subject' }]
    });
  }

  async updateByStudentAndSubject(studentId, subjectId, data) {
    return Grade.update(data, {
      where: {
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectId)
      },
    });
  }

  async findById(id) {
    return Grade.findByPk(id, {
        include: [{ model: Subject, as: 'subject' }]
    });
  }

  async update(id, data) {
    return Grade.update(data, { where: { id: parseInt(id) } });
  }

  async delete(id) {
    return Grade.destroy({ where: { id: parseInt(id) } });
  }
}

module.exports = new GradeRepository();
