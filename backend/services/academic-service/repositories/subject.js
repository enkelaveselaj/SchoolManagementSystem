
const { Subject } = require('../src/models');

class SubjectRepository {
  async create(data) {
    return Subject.create(data);
  }

  async getAll() {
    return Subject.findAll();
  }

  async getById(id) {
    return Subject.findByPk(id);
  }

  async update(id, data) {
    const subject = await Subject.findByPk(id);
    if (!subject) return null;
    return subject.update(data);
  }

  async delete(id) {
    const subject = await Subject.findByPk(id);
    if (!subject) return null;
    await subject.destroy();
    return subject;
  }
}

module.exports = new SubjectRepository();