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

  // Find attendance by student, class, subject, and date
  async findByStudentClassSubjectDate(studentId, classId, subjectId, date) {
    return Attendance.findOne({
      where: {
        studentId,
        classId,
        subjectId,
        date
      }
    });
  }

  // Find attendance by class and date
  async findByClassAndDate(classId, date, subjectId = null) {
    const whereClause = {
      classId,
      date
    };

    if (subjectId) {
      whereClause.subjectId = subjectId;
    }

    return Attendance.findAll({
      where: whereClause,
      order: [['date', 'DESC']]
    });
  }

  // Find attendance by student with date range
  async findByStudentWithDateRange(studentId, startDate = null, endDate = null) {
    const whereClause = { studentId };

    if (startDate && endDate) {
      whereClause.date = {
        [require('sequelize').Op.between]: [startDate, endDate]
      };
    }

    return Attendance.findAll({
      where: whereClause,
      order: [['date', 'DESC']]
    });
  }

  // Get class statistics
  async getClassStats(classId, startDate = null, endDate = null) {
    const whereClause = { classId };

    if (startDate && endDate) {
      whereClause.date = {
        [require('sequelize').Op.between]: [startDate, endDate]
      };
    }

    const stats = await Attendance.findAll({
      where: whereClause,
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').literal('CASE WHEN status = "excused" THEN 1 END')), 'excusedCount']
      ],
      raw: true
    });

    return stats[0] || {
      totalRecords: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      excusedCount: 0
    };
  }

  // Get student statistics
  async getStudentStats(studentId, startDate = null, endDate = null) {
    const whereClause = { studentId };

    if (startDate && endDate) {
      whereClause.date = {
        [require('sequelize').Op.between]: [startDate, endDate]
      };
    }

    const stats = await Attendance.findAll({
      where: whereClause,
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').literal('CASE WHEN status = "excused" THEN 1 END')), 'excusedCount']
      ],
      raw: true
    });

    return stats[0] || {
      totalRecords: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      excusedCount: 0
    };
  }

  // Find attendance with filters
  async findWithFilters(filters) {
    const { classIds, startDate, endDate, subjectId, teacherId } = filters;
    
    const whereClause = {};
    
    if (classIds && classIds.length > 0) {
      whereClause.classId = { [require('sequelize').Op.in]: classIds };
    }
    
    if (startDate && endDate) {
      whereClause.date = {
        [require('sequelize').Op.between]: [startDate, endDate]
      };
    }
    
    if (subjectId) {
      whereClause.subjectId = subjectId;
    }
    
    if (teacherId) {
      whereClause.teacherId = teacherId;
    }

    return Attendance.findAll({
      where: whereClause,
      order: [['date', 'DESC']]
    });
  }

  // Get summary statistics
  async getSummaryStats(startDate, endDate) {
    const summary = await Attendance.findAll({
      where: {
        date: {
          [require('sequelize').Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').literal('CASE WHEN status = "excused" THEN 1 END')), 'excusedCount']
      ],
      raw: true
    });

    return summary[0] || {
      totalRecords: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      excusedCount: 0
    };
  }
}

module.exports = new AttendanceRepository();
