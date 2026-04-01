
const attendanceService = require('../services/attendance');

class AttendanceController {
  async create(req, res) {
    try {
      const attendance = await attendanceService.createAttendance(req.body);
      res.status(201).json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const attendances = await attendanceService.getAllAttendances();
      res.json(attendances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const attendance = await attendanceService.getAttendanceById(req.params.id);
      if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await attendanceService.updateAttendance(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Attendance not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await attendanceService.deleteAttendance(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Attendance not found' });
      res.json({ message: 'Attendance deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AttendanceController();