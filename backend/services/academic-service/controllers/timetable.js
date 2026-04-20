const timetableService = require("../services/timetable");

class TimetableController {
  async create(req, res) {
    try {
      const timetable = await timetableService.createTimetable(req.body);
      res.status(201).json(timetable);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const timetables = await timetableService.getAllTimetables();
      res.json(timetables);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const timetable = await timetableService.getTimetableById(req.params.id);
      if (!timetable) return res.status(404).json({ message: "Not found" });
      res.json(timetable);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      await timetableService.updateTimetable(req.params.id, req.body);
      res.json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await timetableService.deleteTimetable(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new TimetableController();