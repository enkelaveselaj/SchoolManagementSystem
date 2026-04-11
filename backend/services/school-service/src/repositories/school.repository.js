const School = require("../models/school.model");

const getSchool = async () => {
  return await School.findOne();
};

const updateSchool = async (schoolData) => {
  const { name, address } = schoolData;
  const [affectedRows] = await School.update(
    { name, address },
    { limit: 1 }
  );
  return affectedRows > 0;
};

module.exports = { getSchool, updateSchool };