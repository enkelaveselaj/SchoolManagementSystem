const attendanceRepository = require('../repositories/attendance');

class AttendanceService {
  // Mark attendance for multiple students in a class
  async markAttendance(attendanceData) {
    try {
      console.log('MARK ATTENDANCE - Input data:', attendanceData);
      const { classId, subjectId, teacherId, date, markedBy, attendanceRecords } = attendanceData;
      
      // Validate that the date is not in the past for future marking
      const attendanceDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (attendanceDate > today) {
        throw new Error('Cannot mark attendance for future dates');
      }

      const results = [];
      
      for (const record of attendanceRecords) {
        const { studentId, status, checkInTime, checkOutTime, notes, isLate, lateMinutes } = record;
        
        console.log('Processing attendance record:', record);
        console.log('Looking for existing attendance for studentId:', studentId, 'classId:', classId, 'subjectId:', subjectId, 'date:', date);
        
        // Check if attendance already exists for this student on this date
        const existingAttendance = await attendanceRepository.findByStudentClassSubjectDate(studentId, classId, subjectId, date);
        console.log('Existing attendance found:', existingAttendance);

        if (existingAttendance) {
          // Update existing attendance
          const updatedAttendance = await attendanceRepository.update(existingAttendance.id, {
            status,
            checkInTime,
            checkOutTime,
            notes,
            isLate,
            lateMinutes,
            markedBy
          });
          console.log('Updated attendance:', updatedAttendance);
          results.push(updatedAttendance);
        } else {
          // Create new attendance record
          const newAttendance = await attendanceRepository.create({
            studentId,
            classId,
            subjectId,
            teacherId,
            date,
            status,
            checkInTime,
            checkOutTime,
            notes,
            isLate,
            lateMinutes,
            markedBy
          });
          console.log('Created new attendance:', newAttendance);
          results.push(newAttendance);
        }
      }

      console.log('Final results array:', results);
      return results;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  // Get attendance for a specific class and date
  async getClassAttendance(classId, date, subjectId = null) {
    try {
      console.log('GET CLASS ATTENDANCE - Input data:', classId, date, subjectId);
      const attendances = await attendanceRepository.findByClassAndDate(classId, date, subjectId);
      console.log('Attendances found:', attendances);
      return attendances;
    } catch (error) {
      console.error('Error getting class attendance:', error);
      throw error;
    }
  }

  // Get attendance for a specific student
  async getStudentAttendance(studentId, startDate = null, endDate = null) {
    try {
      const attendances = await attendanceRepository.findByStudentWithDateRange(studentId, startDate, endDate);
      return attendances;
    } catch (error) {
      console.error('Error getting student attendance:', error);
      throw error;
    }
  }

  // Get attendance statistics for a class
  async getClassAttendanceStats(classId, startDate = null, endDate = null) {
    try {
      const stats = await attendanceRepository.getClassStats(classId, startDate, endDate);
      
      // Calculate attendance rate
      const attendanceRate = stats.totalRecords > 0 
        ? ((stats.presentCount + stats.lateCount) / stats.totalRecords) * 100 
        : 0;

      return {
        ...stats,
        attendanceRate: Math.round(attendanceRate * 100) / 100
      };
    } catch (error) {
      console.error('Error getting class attendance stats:', error);
      throw error;
    }
  }

  // Get attendance statistics for a student
  async getStudentAttendanceStats(studentId, startDate = null, endDate = null) {
    try {
      const stats = await attendanceRepository.getStudentStats(studentId, startDate, endDate);
      
      // Calculate attendance rate
      const attendanceRate = stats.totalRecords > 0 
        ? ((stats.presentCount + stats.lateCount) / stats.totalRecords) * 100 
        : 0;

      return {
        ...stats,
        attendanceRate: Math.round(attendanceRate * 100) / 100
      };
    } catch (error) {
      console.error('Error getting student attendance stats:', error);
      throw error;
    }
  }

  // Get attendance report with filters
  async getAttendanceReport(filters) {
    try {
      const { classIds, startDate, endDate, subjectId, teacherId } = filters;
      const attendances = await attendanceRepository.findWithFilters(filters);
      return attendances;
    } catch (error) {
      console.error('Error getting attendance report:', error);
      throw error;
    }
  }

  // Basic CRUD operations (keeping existing ones)
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

  // Get attendance summary for dashboard
  async getAttendanceSummary() {
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 30); // Last 30 days

      const summary = await attendanceRepository.getSummaryStats(startDate, today);

      const attendanceRate = summary.totalRecords > 0 
        ? ((summary.presentCount + summary.lateCount) / summary.totalRecords) * 100 
        : 0;

      return {
        ...summary,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        period: 'Last 30 days'
      };
    } catch (error) {
      console.error('Error getting attendance summary:', error);
      throw error;
    }
  }
}

module.exports = new AttendanceService();