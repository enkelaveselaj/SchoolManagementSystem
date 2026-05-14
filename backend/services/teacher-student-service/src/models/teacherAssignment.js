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
        allowNull: true,
      },

      academicYearId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }
  );

  return TeacherAssignment;
};