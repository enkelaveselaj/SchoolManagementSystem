const attendanceService = require('../services/attendance');

class AttendanceController {
  // Mark attendance for multiple students
  async markAttendance(req, res) {
    try {
      const attendanceData = req.body;
      const markedBy = req.user?.id || 1; // Default to 1 if no user context
      
      attendanceData.markedBy = markedBy;
      
      const results = await attendanceService.markAttendance(attendanceData);
      
      res.status(201).json({
        message: 'Attendance marked successfully',
        data: results,
        count: results.length
      });
    } catch (error) {
      console.error('Error marking attendance:', error);
      res.status(500).json({
        error: error.message || 'Failed to mark attendance'
      });
    }
  }

  // Get attendance for a specific class and date
  async getClassAttendance(req, res) {
    try {
      const { classId } = req.params;
      const { date, subjectId } = req.query;
      
      if (!date) {
        return res.status(400).json({
          error: 'Date is required'
        });
      }
      
      const attendances = await attendanceService.getClassAttendance(
        parseInt(classId),
        date,
        subjectId ? parseInt(subjectId) : null
      );
      
      res.json({
        message: 'Class attendance retrieved successfully',
        data: attendances
      });
    } catch (error) {
      console.error('Error getting class attendance:', error);
      res.status(500).json({
        error: error.message || 'Failed to get class attendance'
      });
    }
  }

  // Get attendance for a specific student
  async getStudentAttendance(req, res) {
    try {
      const { studentId } = req.params;
      const { startDate, endDate } = req.query;
      
      const attendances = await attendanceService.getStudentAttendance(
        parseInt(studentId),
        startDate,
        endDate
      );
      
      res.json({
        message: 'Student attendance retrieved successfully',
        data: attendances
      });
    } catch (error) {
      console.error('Error getting student attendance:', error);
      res.status(500).json({
        error: error.message || 'Failed to get student attendance'
      });
    }
  }

  // Get attendance statistics for a class
  async getClassAttendanceStats(req, res) {
    try {
      const { classId } = req.params;
      const { startDate, endDate } = req.query;
      
      const stats = await attendanceService.getClassAttendanceStats(
        parseInt(classId),
        startDate,
        endDate
      );
      
      res.json({
        message: 'Class attendance statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting class attendance stats:', error);
      res.status(500).json({
        error: error.message || 'Failed to get class attendance statistics'
      });
    }
  }

  // Get attendance statistics for a student
  async getStudentAttendanceStats(req, res) {
    try {
      const { studentId } = req.params;
      const { startDate, endDate } = req.query;
      
      const stats = await attendanceService.getStudentAttendanceStats(
        parseInt(studentId),
        startDate,
        endDate
      );
      
      res.json({
        message: 'Student attendance statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting student attendance stats:', error);
      res.status(500).json({
        error: error.message || 'Failed to get student attendance statistics'
      });
    }
  }

  // Get attendance report with filters
  async getAttendanceReport(req, res) {
    try {
      const filters = req.query;
      
      // Convert string arrays to actual arrays
      if (filters.classIds && typeof filters.classIds === 'string') {
        filters.classIds = filters.classIds.split(',').map(id => parseInt(id));
      }
      
      const attendances = await attendanceService.getAttendanceReport(filters);
      
      res.json({
        message: 'Attendance report retrieved successfully',
        data: attendances,
        count: attendances.length
      });
    } catch (error) {
      console.error('Error getting attendance report:', error);
      res.status(500).json({
        error: error.message || 'Failed to get attendance report'
      });
    }
  }

  // Get attendance summary for dashboard
  async getAttendanceSummary(req, res) {
    try {
      const summary = await attendanceService.getAttendanceSummary();
      
      res.json({
        message: 'Attendance summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      console.error('Error getting attendance summary:', error);
      res.status(500).json({
        error: error.message || 'Failed to get attendance summary'
      });
    }
  }

  // Existing CRUD methods
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