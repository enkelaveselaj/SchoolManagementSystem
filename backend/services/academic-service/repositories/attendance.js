
const { Attendance } = require('../src/models');

class AttendanceRepository {
  async create(data) {
    return Attendance.create(data);
  }

  async getAll() {
    return Attendance.findAll();
  }

  async getById(id) {
    return Attendance.findByPk(id);
  }

  async update(id, data) {
    const attendance = await Attendance.findByPk(id);
    if (!attendance) return null;
    return attendance.update(data);
  }

  async delete(id) {
    const attendance = await Attendance.findByPk(id);
    if (!attendance) return null;
    await attendance.destroy();
    return attendance;
  }
}

module.exports = new AttendanceRepository();