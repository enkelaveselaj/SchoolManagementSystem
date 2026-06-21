const { Attendance, Subject } = require('../src/models');
const { Op } = require('sequelize');

class AttendanceRepository {
  async create(data) {
    return Attendance.create({
        ...data,
        studentId: parseInt(data.studentId),
        classId: parseInt(data.classId),
        subjectId: parseInt(data.subjectId),
        teacherId: parseInt(data.teacherId),
        markedBy: parseInt(data.markedBy)
    });
  }

  async getAll() {
    return Attendance.findAll({
        include: [{ model: Subject, as: 'subject' }]
    });
  }

  async getById(id) {
    return Attendance.findByPk(parseInt(id), {
        include: [{ model: Subject, as: 'subject' }]
    });
  }

  async update(id, data) {
    return Attendance.update(data, { where: { id: parseInt(id) } });
  }

  async delete(id) {
    return Attendance.destroy({ where: { id: parseInt(id) } });
  }

  async findByStudentClassSubjectDate(studentId, classId, subjectId, date) {
    return Attendance.findOne({
      where: {
        studentId: parseInt(studentId),
        classId: parseInt(classId),
        subjectId: parseInt(subjectId),
        date
      }
    });
  }

  async findByClassAndDate(classId, date, subjectId = null) {
    const where = { classId: parseInt(classId), date };
    if (subjectId) where.subjectId = parseInt(subjectId);
    return Attendance.findAll({
        where,
        include: [{ model: Subject, as: 'subject' }],
        order: [['date', 'DESC']]
    });
  }

  async findByStudentWithDateRange(studentId, startDate = null, endDate = null) {
    const where = { studentId: parseInt(studentId) };
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };
    return Attendance.findAll({
        where,
        include: [{ model: Subject, as: 'subject' }],
        order: [['date', 'DESC']]
    });
  }

  async getClassStats(classId, startDate = null, endDate = null) {
    const where = { classId: parseInt(classId) };
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };

    const stats = await Attendance.findAll({
      where,
      attributes: [
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'present' THEN 1 END")), 'presentCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'absent' THEN 1 END")), 'absentCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'late' THEN 1 END")), 'lateCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'excused' THEN 1 END")), 'excusedCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal('1')), 'totalRecords']
      ],
      raw: true
    });
    return stats[0];
  }

  async getStudentStats(studentId, startDate = null, endDate = null) {
    const where = { studentId: parseInt(studentId) };
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };

    const stats = await Attendance.findAll({
      where,
      attributes: [
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'present' THEN 1 END")), 'presentCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'absent' THEN 1 END")), 'absentCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'late' THEN 1 END")), 'lateCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'excused' THEN 1 END")), 'excusedCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal('1')), 'totalRecords']
      ],
      raw: true
    });
    return stats[0];
  }

  async findWithFilters(filters) {
    const { classIds, startDate, endDate, subjectId, teacherId } = filters;
    const where = {};
    if (classIds) where.classId = { [Op.in]: Array.isArray(classIds) ? classIds.map(id => parseInt(id)) : [parseInt(classIds)] };
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };
    if (subjectId) where.subjectId = parseInt(subjectId);
    if (teacherId) where.teacherId = parseInt(teacherId);

    return Attendance.findAll({
        where,
        include: [{ model: Subject, as: 'subject' }],
        order: [['date', 'DESC']]
    });
  }

  async getSummaryStats(startDate, endDate) {
    const summary = await Attendance.findAll({
      where: { date: { [Op.between]: [startDate, endDate] } },
      attributes: [
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'present' THEN 1 END")), 'presentCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'absent' THEN 1 END")), 'absentCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'late' THEN 1 END")), 'lateCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal("CASE WHEN status = 'excused' THEN 1 END")), 'excusedCount'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.literal('1')), 'totalRecords']
      ],
      raw: true
    });
    return summary[0];
  }
}

module.exports = new AttendanceRepository();
