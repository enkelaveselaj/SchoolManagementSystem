const schoolRepository = require("../repositories/school.repository");

const getSchool = async () => {
  return await schoolRepository.getSchool();
};

const updateSchool = async (schoolData) => {
  return await schoolRepository.updateSchool(schoolData);
};

module.exports = { getSchool, updateSchool };