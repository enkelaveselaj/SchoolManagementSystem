export default (sequelize, DataTypes) => {
  const TeacherAssignment = sequelize.define(
    "TeacherAssignment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      academicYearId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
  );

  return TeacherAssignment;
};