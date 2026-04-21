module.exports = (sequelize, DataTypes) => {
  const Timetable = sequelize.define("Timetable", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gradeId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: 'grade_id'
    },
    subjectId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: 'subject_id'
    },
    day: { type: DataTypes.STRING, allowNull: false }, // e.g., Monday
    startTime: { 
      type: DataTypes.TIME, 
      allowNull: false,
      field: 'start_time'
    },
    endTime: { 
      type: DataTypes.TIME, 
      allowNull: false,
      field: 'end_time'
    },
    room: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'Timetables',
    timestamps: false,
    alter: true
  });

  return Timetable;
};