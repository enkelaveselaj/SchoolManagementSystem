const sectionRepository = require("../repositories/section.repository");

const getAllSections = async () => {
  try {
    return await sectionRepository.getAllSections();
  } catch (error) {
    throw new Error(`Failed to fetch sections: ${error.message}`);
  }
};

const getSectionById = async (id) => {
  try {
    const section = await sectionRepository.getSectionById(id);
    if (!section) {
      throw new Error("Section not found");
    }
    return section;
  } catch (error) {
    throw new Error(`Failed to fetch section: ${error.message}`);
  }
};

const getSectionsByClass = async (classId) => {
  try {
    if (!classId) {
      throw new Error("Class ID is required");
    }
    return await sectionRepository.getSectionsByClass(classId);
  } catch (error) {
    throw new Error(`Failed to fetch sections for class: ${error.message}`);
  }
};

const createSection = async (sectionData) => {
  try {
    const { classId, name, capacity, roomNumber } = sectionData;
    
    // Validate required fields
    if (!classId || !name) {
      throw new Error("Class ID and name are required");
    }
    
    if (capacity && capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }
    
    // Check if section with same name already exists in the same class
    const existingSections = await sectionRepository.getSectionsByClass(classId);
    const duplicate = existingSections.find(sec => sec.name === name);
    if (duplicate) {
      throw new Error("Section with this name already exists in this class");
    }
    
    return await sectionRepository.createSection(sectionData);
  } catch (error) {
    throw new Error(`Failed to create section: ${error.message}`);
  }
};

const updateSection = async (id, sectionData) => {
  try {
    const existingSection = await sectionRepository.getSectionById(id);
    if (!existingSection) {
      throw new Error("Section not found");
    }
    
    const { classId, name, capacity, roomNumber } = sectionData;
    
    // Validate capacity if provided
    if (capacity && capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }
    
    // Check for duplicates if name or class is being changed
    if (name || classId) {
      const existingSections = await sectionRepository.getSectionsByClass(classId || existingSection.class_id);
      const duplicate = existingSections.find(sec => 
        sec.id !== id && (name || existingSection.name) === sec.name
      );
      if (duplicate) {
        throw new Error("Section with this name already exists in this class");
      }
    }
    
    const success = await sectionRepository.updateSection(id, sectionData);
    if (!success) {
      throw new Error("Failed to update section");
    }
    
    return await sectionRepository.getSectionById(id);
  } catch (error) {
    throw new Error(`Failed to update section: ${error.message}`);
  }
};

const deleteSection = async (id) => {
  try {
    const existingSection = await sectionRepository.getSectionById(id);
    if (!existingSection) {
      throw new Error("Section not found");
    }
    
    // Check if there are any students enrolled in this section
    const students = await sectionRepository.getStudentsInSection(id);
    if (students && students.length > 0) {
      throw new Error("Cannot delete section with enrolled students. Please reassign or remove students first.");
    }
    
    const success = await sectionRepository.deleteSection(id);
    if (!success) {
      throw new Error("Failed to delete section");
    }
    
    return true;
  } catch (error) {
    throw new Error(`Failed to delete section: ${error.message}`);
  }
};

const getStudentsInSection = async (sectionId) => {
  try {
    if (!sectionId) {
      throw new Error("Section ID is required");
    }
    
    const section = await sectionRepository.getSectionById(sectionId);
    if (!section) {
      throw new Error("Section not found");
    }
    
    return await sectionRepository.getStudentsInSection(sectionId);
  } catch (error) {
    throw new Error(`Failed to fetch students in section: ${error.message}`);
  }
};

const getSectionCapacity = async (sectionId) => {
  try {
    if (!sectionId) {
      throw new Error("Section ID is required");
    }
    
    const section = await sectionRepository.getSectionById(sectionId);
    if (!section) {
      throw new Error("Section not found");
    }
    
    const capacity = await sectionRepository.getSectionCapacity(sectionId);
    if (!capacity) {
      throw new Error("Unable to fetch capacity information");
    }
    
    return capacity;
  } catch (error) {
    throw new Error(`Failed to fetch section capacity: ${error.message}`);
  }
};

module.exports = {
  getAllSections,
  getSectionById,
  getSectionsByClass,
  createSection,
  updateSection,
  deleteSection,
  getStudentsInSection,
  getSectionCapacity
};
