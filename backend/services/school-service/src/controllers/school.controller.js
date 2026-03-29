const schoolService = require("../services/school.service");

exports.getSchool = async (req, res) => {
  try {
    const school = await schoolService.getSchool();
    res.json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const updated = await schoolService.updateSchool(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};