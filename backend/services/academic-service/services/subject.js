
const subjectRepository = require('../repositories/subject');

class SubjectService {
  createSubject(data) {
    return subjectRepository.create(data);
  }

  getAllSubjects() {
    return subjectRepository.getAll();
  }

  getSubjectById(id) {
    return subjectRepository.getById(id);
  }

  updateSubject(id, data) {
    return subjectRepository.update(id, data);
  }

  deleteSubject(id) {
    return subjectRepository.delete(id);
  }
}

module.exports = new SubjectService();