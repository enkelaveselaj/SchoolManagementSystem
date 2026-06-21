module.exports = (sequelize, DataTypes) => {
  const AssessmentScore = sequelize.define("AssessmentScore", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'assessment_id'
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id'
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'submitted_at'
    },
    gradedAt: {
      type: DataTypes.DATE,
      field: 'graded_at'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'AssessmentScores',
    timestamps: true,
    alter: true
  });

  AssessmentScore.associate = (models) => {
    AssessmentScore.belongsTo(models.Assessment, { foreignKey: 'assessmentId', as: 'assessment' });
  };

  return AssessmentScore;
};
