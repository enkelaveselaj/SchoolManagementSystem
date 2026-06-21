const attendanceRepository = require('../repositories/attendance');
const notificationService = require('./notificationService');
const authServiceClient = require('./authServiceClient');
const { Subject } = require("../src/models");

const normalizeCounts = (stats) => ({
  ...stats,
  totalRecords: Number(stats.totalRecords) || 0,
  presentCount: Number(stats.presentCount) || 0,
  absentCount: Number(stats.absentCount) || 0,
  lateCount: Number(stats.lateCount) || 0,
  excusedCount: Number(stats.excusedCount) || 0,
});

class AttendanceService {
  async markAttendance(attendanceData) {
    try {
      const { classId, subjectId, teacherId, date, markedBy, attendanceRecords } = attendanceData;
      
      // 1. Verify the subject exists in THIS database
      const subject = await Subject.findByPk(parseInt(subjectId));
      if (!subject) {
          throw new Error(`Subject with ID ${subjectId} not found in Academic database. Create it in Admin Setup first.`);
      }

      const inputDate = date;
      const today = new Date().toISOString().split('T')[0];
      
      if (inputDate > today) {
        throw new Error(`Cannot mark attendance for future date: ${inputDate}. Today is ${today}`);
      }

      const results = [];
      
      for (const record of attendanceRecords) {
        const { studentId, status } = record;
        
        if (!studentId || !status) continue;

        const existingAttendance = await attendanceRepository.findByStudentClassSubjectDate(studentId, classId, subjectId, date);

        if (existingAttendance) {
          const updated = await attendanceRepository.update(existingAttendance.id, {
            status: status.toLowerCase(),
            markedBy: parseInt(markedBy) || parseInt(teacherId)
          });
          results.push(updated);
        } else {
          const created = await attendanceRepository.create({
            studentId,
            classId,
            subjectId,
            teacherId,
            date,
            status: status.toLowerCase(),
            markedBy: parseInt(markedBy) || parseInt(teacherId)
          });
          results.push(created);
        }
      }

      return results;
    } catch (error) {
      console.error('Service error marking attendance:', error);
      throw error;
    }
  }

  async getClassAttendance(classId, date, subjectId = null) {
    return attendanceRepository.findByClassAndDate(classId, date, subjectId);
  }

  async getStudentAttendance(studentId, startDate = null, endDate = null) {
    return attendanceRepository.findByStudentWithDateRange(studentId, startDate, endDate);
  }

  async getClassAttendanceStats(classId, startDate = null, endDate = null) {
    const stats = normalizeCounts(await attendanceRepository.getClassStats(classId, startDate, endDate));
    const attendanceRate = stats.totalRecords > 0
      ? ((stats.presentCount + stats.lateCount) / stats.totalRecords) * 100
      : 0;
    return { ...stats, attendanceRate: Math.round(attendanceRate * 100) / 100 };
  }

  async getStudentAttendanceStats(studentId, startDate = null, endDate = null) {
    const stats = normalizeCounts(await attendanceRepository.getStudentStats(studentId, startDate, endDate));
    const attendanceRate = stats.totalRecords > 0
      ? ((stats.presentCount + stats.lateCount) / stats.totalRecords) * 100
      : 0;
    return { ...stats, attendanceRate: Math.round(attendanceRate * 100) / 100 };
  }

  async getAttendanceReport(filters) {
    return attendanceRepository.findWithFilters(filters);
  }

  createAttendance(data) {
    return attendanceRepository.create(data);
  }

  getAllAttendances() {
    return attendanceRepository.getAll();
  }

  getAttendanceById(id) {
    return attendanceRepository.getById(id);
  }

  updateAttendance(id, data) {
    return attendanceRepository.update(id, data);
  }

  deleteAttendance(id) {
    return attendanceRepository.delete(id);
  }

  async getAttendanceSummary() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);
    const summary = await attendanceRepository.getSummaryStats(startDate, today);
    const attendanceRate = summary.totalRecords > 0
      ? ((summary.presentCount + summary.lateCount) / summary.totalRecords) * 100
      : 0;
    return { ...summary, attendanceRate: Math.round(attendanceRate * 100) / 100, period: 'Last 30 days' };
  }
}

module.exports = new AttendanceService();
