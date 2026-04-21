// src/models/attendance.js
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id'
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'class_id'
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'subject_id'
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'teacher_id'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      allowNull: false,
      defaultValue: 'present'
    },
    checkInTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'check_in_time'
    },
    checkOutTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'check_out_time'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    markedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'marked_by'
    },
    isLate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_late'
    },
    lateMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'late_minutes'
    }
  }, {
    tableName: 'attendances',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Attendance;
};