module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define("Assessment", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'subject_id'
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'class_id'
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'teacher_id'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 100,
      field: 'max_score'
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 10,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: 'Assessments',
    timestamps: true,
    alter: true
  });

  Assessment.associate = (models) => {
    Assessment.hasMany(models.AssessmentScore, { foreignKey: 'assessmentId', as: 'scores' });
    Assessment.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
  };

  return Assessment;
};