const pool = require("../models/school.model");

const getSchool = async () => {
  const [rows] = await pool.query("SELECT * FROM schools LIMIT 1");
  return rows[0];
};

const updateSchool = async (schoolData) => {
  const { name, address } = schoolData;
  const [result] = await pool.query(
    "UPDATE schools SET name = ?, address = ? LIMIT 1",
    [name, address]
  );
  return result;
};

module.exports = { getSchool, updateSchool };