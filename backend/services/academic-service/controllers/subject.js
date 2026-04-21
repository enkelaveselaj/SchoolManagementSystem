// src/controllers/subject.js
const subjectService = require('../services/subject');

class SubjectController {
  async create(req, res) {
    try {
      const subject = await subjectService.createSubject(req.body);
      res.status(201).json(subject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      console.log('Getting all subjects...');
      const subjects = await subjectService.getAllSubjects();
      console.log('Subjects found:', subjects);
      console.log('Subjects count:', subjects.length);
      res.json(subjects);
    } catch (err) {
      console.error('Error getting subjects:', err);
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      console.log('Getting subject by ID...');
      const subject = await subjectService.getSubjectById(req.params.id);
      console.log('Subject found:', subject);
      if (!subject) return res.status(404).json({ message: 'Subject not found' });
      res.json(subject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await subjectService.updateSubject(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Subject not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await subjectService.deleteSubject(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Subject not found' });
      res.json({ message: 'Subject deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getTeacherSubjects(req, res) {
    try {
      const { teacherId } = req.params;
      
      // For now, return all subjects (in a real implementation, you'd filter by teacher assignments)
      const subjects = await subjectService.getAllSubjects();
      
      // Mock teacher-subject assignments - in real implementation, this would come from a junction table
      const mockAssignments = {
        'teacher-1': [1, 2] // Assign teacher-1 to subjects with IDs 1 and 2
      };
      
      const assignedSubjectIds = mockAssignments[teacherId] || [];
      const teacherSubjects = subjects.filter(subject => 
        assignedSubjectIds.includes(subject.id)
      );
      
      res.json(teacherSubjects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new SubjectController();