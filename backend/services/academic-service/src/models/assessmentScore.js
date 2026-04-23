module.exports = (sequelize, DataTypes) => {
  const AssessmentScore = sequelize.define("AssessmentScore", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    assessmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    gradedAt: {
      type: DataTypes.DATE,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'AssessmentScores',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  AssessmentScore.associate = (models) => {
    AssessmentScore.belongsTo(models.Assessment, { foreignKey: 'assessmentId', as: 'assessment' });
  };

  return AssessmentScore;
};
