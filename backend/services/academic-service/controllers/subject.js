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
      const subjects = await subjectService.getAllSubjects();
      res.json(subjects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const subject = await subjectService.getSubjectById(req.params.id);
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
}

module.exports = new SubjectController();