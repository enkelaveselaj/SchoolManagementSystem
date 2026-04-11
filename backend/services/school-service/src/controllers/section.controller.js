const sectionService = require("../services/section.service");

exports.getAllSections = async (req, res) => {
  try {
    const sections = await sectionService.getAllSections();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await sectionService.getSectionById(id);
    res.json(section);
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.getSectionsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const sections = await sectionService.getSectionsByClass(classId);
    res.json(sections);
  } catch (err) {
    if (err.message.includes("required")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.createSection = async (req, res) => {
  try {
    const section = await sectionService.createSection(req.body);
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await sectionService.updateSection(id, req.body);
    res.json(section);
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    await sectionService.deleteSection(id);
    res.status(204).send();
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.getStudentsInSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const students = await sectionService.getStudentsInSection(sectionId);
    res.json(students);
  } catch (err) {
    if (err.message.includes("not found") || err.message.includes("required")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.getSectionCapacity = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const capacity = await sectionService.getSectionCapacity(sectionId);
    res.json(capacity);
  } catch (err) {
    if (err.message.includes("not found") || err.message.includes("required")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
