module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define("Assessment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 10,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    // This will automatically add the new columns to the table
    // if they don't exist, Sequelize will create them
    alter: true
  });

  return Assessment;
};