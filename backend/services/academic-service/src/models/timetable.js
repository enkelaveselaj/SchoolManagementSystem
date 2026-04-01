
module.exports = (sequelize, DataTypes) => {
  const Timetable = sequelize.define("Timetable", {
    gradeId: { type: DataTypes.INTEGER, allowNull: false },
    subjectId: { type: DataTypes.INTEGER, allowNull: false },
    teacherId: { type: DataTypes.INTEGER, allowNull: false },
    day: { type: DataTypes.STRING, allowNull: false }, // e.g., Monday
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    room: { type: DataTypes.STRING, allowNull: true }
  });

  return Timetable;
};