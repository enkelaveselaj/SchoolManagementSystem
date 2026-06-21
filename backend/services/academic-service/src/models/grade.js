module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define("Grade", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id'
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
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    letter: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    semester: {
      type: DataTypes.STRING,
    },
    schoolYear: {
      type: DataTypes.STRING,
      field: 'school_year'
    },
    finalizedAt: {
      type: DataTypes.DATE,
      field: 'finalized_at'
    },
  }, {
    tableName: 'Grades',
    timestamps: true,
    alter: true
  });

  Grade.associate = (models) => {
    Grade.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
  };

  return Grade;
};
