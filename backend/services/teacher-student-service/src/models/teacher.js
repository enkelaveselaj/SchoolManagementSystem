export default (sequelize, DataTypes) => {
  const Teacher = sequelize.define("Teacher", {
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
      defaultValue: null,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    hireDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    emergencyPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
  });

  return Teacher;
};