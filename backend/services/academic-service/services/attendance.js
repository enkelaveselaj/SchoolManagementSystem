
const attendanceRepository = require('../repositories/attendance');

class AttendanceService {
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
}

module.exports = new AttendanceService();