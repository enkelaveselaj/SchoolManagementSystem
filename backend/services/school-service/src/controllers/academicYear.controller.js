const academicYearService = require("../services/academicYear.service");

exports.getAllAcademicYears = async (req, res) => {
  try {
    const academicYears = await academicYearService.getAllAcademicYears();
    res.json(academicYears);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;
    const academicYear = await academicYearService.getAcademicYearById(id);
    res.json(academicYear);
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.createAcademicYear = async (req, res) => {
  try {
    const academicYear = await academicYearService.createAcademicYear(req.body);
    res.status(201).json(academicYear);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const academicYear = await academicYearService.updateAcademicYear(id, req.body);
    res.json(academicYear);
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    await academicYearService.deleteAcademicYear(id);
    res.status(204).send();
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.getCurrentAcademicYear = async (req, res) => {
  try {
    const currentYear = await academicYearService.getCurrentAcademicYear();
    res.json(currentYear);
  } catch (err) {
    if (err.message.includes("No current academic year")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.setCurrentAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const academicYear = await academicYearService.setCurrentAcademicYear(id);
    res.json(academicYear);
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};
