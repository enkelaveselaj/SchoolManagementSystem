const { Assessment, Subject } = require("../src/models");

class AssessmentRepository {
  async create(data) {
    return Assessment.create({
        ...data,
        subjectId: parseInt(data.subjectId),
        teacherId: parseInt(data.teacherId),
        classId: data.classId ? parseInt(data.classId) : null
    });
  }

  async findAll() {
    return Assessment.findAll({
        include: [{ model: Subject, as: 'subject' }]
    });
  }

  async findById(id) {
    return Assessment.findByPk(parseInt(id), {
        include: [{ model: Subject, as: 'subject' }]
    });
  }

  async findByIdWithScores(id) {
    return Assessment.findByPk(parseInt(id), {
      include: [
        { model: Subject, as: 'subject' },
        {
          model: require('../src/models').AssessmentScore,
          as: 'scores'
        }
      ]
    });
  }

  async findByStudentAndSubject(studentId, subjectId) {
    return Assessment.findAll({
      where: { subjectId: parseInt(subjectId) },
      include: [{ model: Subject, as: 'subject' }]
    });
  }

  async update(id, data) {
    return Assessment.update(data, { where: { id: parseInt(id) } });
  }

  async delete(id) {
    return Assessment.destroy({ where: { id: parseInt(id) } });
  }
}

module.exports = new AssessmentRepository();
