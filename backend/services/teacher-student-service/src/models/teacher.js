export default (sequelize, DataTypes) => {
  const Teacher = sequelize.define("Teacher", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    hireDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
  });

  return Teacher;
};