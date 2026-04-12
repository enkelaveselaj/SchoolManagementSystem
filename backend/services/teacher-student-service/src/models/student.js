export default (sequelize, DataTypes) => {
  const Student = sequelize.define("Student", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Made optional since this service doesn't handle authentication
      defaultValue: null, // Explicit default value
    },

    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },

    classId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    parentName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    parentPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    parentEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Student;
};