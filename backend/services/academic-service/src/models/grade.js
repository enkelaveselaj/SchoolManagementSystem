module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define("Grade", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING,
    },
    schoolYear: {
      type: DataTypes.STRING,
    },
    finalizedAt: {
      type: DataTypes.DATE,
    },
  });

  return Grade;
};