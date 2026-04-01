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
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late'),
      allowNull: false,
    },
  }, {
    tableName: 'Attendances',
    timestamps: true,
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Subject, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
  };

  return Attendance;
};