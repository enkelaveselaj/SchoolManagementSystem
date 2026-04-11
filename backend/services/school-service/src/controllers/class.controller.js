const classService = require("../services/class.service");

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await classService.getAllClasses();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await classService.getClassById(id);
    res.json(classData);
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.getClassesByAcademicYear = async (req, res) => {
  try {
    const { academicYearId } = req.params;
    const classes = await classService.getClassesByAcademicYear(academicYearId);
    res.json(classes);
  } catch (err) {
    if (err.message.includes("required")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.getClassesByGradeLevel = async (req, res) => {
  try {
    const { gradeLevel } = req.params;
    const classes = await classService.getClassesByGradeLevel(parseInt(gradeLevel));
    res.json(classes);
  } catch (err) {
    if (err.message.includes("required") || err.message.includes("Valid grade level")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.createClass = async (req, res) => {
  try {
    const classData = await classService.createClass(req.body);
    res.status(201).json(classData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await classService.updateClass(id, req.body);
    res.json(classData);
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await classService.deleteClass(id);
    res.status(204).send();
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.getStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await classService.getStudentsInClass(classId);
    res.json(students);
  } catch (err) {
    if (err.message.includes("not found") || err.message.includes("required")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
