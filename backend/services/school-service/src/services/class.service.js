const classRepository = require("../repositories/class.repository");

const getAllClasses = async () => {
  try {
    return await classRepository.getAllClasses();
  } catch (error) {
    throw new Error(`Failed to fetch classes: ${error.message}`);
  }
};

const getClassById = async (id) => {
  try {
    const classData = await classRepository.getClassById(id);
    if (!classData) {
      throw new Error("Class not found");
    }
    return classData;
  } catch (error) {
    throw new Error(`Failed to fetch class: ${error.message}`);
  }
};

const getClassesByAcademicYear = async (academicYearId) => {
  try {
    if (!academicYearId) {
      throw new Error("Academic year ID is required");
    }
    return await classRepository.getClassesByAcademicYear(academicYearId);
  } catch (error) {
    throw new Error(`Failed to fetch classes for academic year: ${error.message}`);
  }
};

const getClassesByGradeLevel = async (gradeLevel) => {
  try {
    if (!gradeLevel || gradeLevel < 1 || gradeLevel > 12) {
      throw new Error("Valid grade level (1-12) is required");
    }
    return await classRepository.getClassesByGradeLevel(gradeLevel);
  } catch (error) {
    throw new Error(`Failed to fetch classes for grade level: ${error.message}`);
  }
};

const createClass = async (classData) => {
  try {
    const { schoolId, academicYearId, gradeLevel, section, name, classTeacherId, capacity } = classData;
    
    // Validate required fields
    if (!academicYearId || !gradeLevel || !section || !name) {
      throw new Error("Academic year ID, grade level, section, and name are required");
    }
    
    if (gradeLevel < 1 || gradeLevel > 12) {
      throw new Error("Grade level must be between 1 and 12");
    }
    
    if (capacity && capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }
    
    // Check if class with same name already exists in the same academic year
    const existingClasses = await classRepository.getClassesByAcademicYear(academicYearId);
    const duplicate = existingClasses.find(cls => 
      cls.name === name && cls.grade_level === gradeLevel && cls.section === section
    );
    if (duplicate) {
      throw new Error("Class with this name, grade level, and section already exists in this academic year");
    }
    
    return await classRepository.createClass(classData);
  } catch (error) {
    throw new Error(`Failed to create class: ${error.message}`);
  }
};

const updateClass = async (id, classData) => {
  try {
    const existingClass = await classRepository.getClassById(id);
    if (!existingClass) {
      throw new Error("Class not found");
    }
    
    const { schoolId, academicYearId, gradeLevel, section, name, classTeacherId, capacity } = classData;
    
    // Validate grade level if provided
    if (gradeLevel && (gradeLevel < 1 || gradeLevel > 12)) {
      throw new Error("Grade level must be between 1 and 12");
    }
    
    // Validate capacity if provided
    if (capacity && capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }
    
    // Check for duplicates if name, grade level, or section is being changed
    if (name || gradeLevel || section) {
      const existingClasses = await classRepository.getClassesByAcademicYear(academicYearId || existingClass.academic_year_id);
      const duplicate = existingClasses.find(cls => 
        cls.id !== id &&
        (name || existingClass.name) === cls.name &&
        (gradeLevel || existingClass.grade_level) === cls.grade_level &&
        (section || existingClass.section) === cls.section
      );
      if (duplicate) {
        throw new Error("Class with this name, grade level, and section already exists in this academic year");
      }
    }
    
    const success = await classRepository.updateClass(id, classData);
    if (!success) {
      throw new Error("Failed to update class");
    }
    
    return await classRepository.getClassById(id);
  } catch (error) {
    throw new Error(`Failed to update class: ${error.message}`);
  }
};

const deleteClass = async (id) => {
  try {
    const existingClass = await classRepository.getClassById(id);
    if (!existingClass) {
      throw new Error("Class not found");
    }
    
    // Check if there are any students enrolled in this class
    const students = await classRepository.getStudentsInClass(id);
    if (students && students.length > 0) {
      throw new Error("Cannot delete class with enrolled students. Please reassign or remove students first.");
    }
    
    const success = await classRepository.deleteClass(id);
    if (!success) {
      throw new Error("Failed to delete class");
    }
    
    return true;
  } catch (error) {
    throw new Error(`Failed to delete class: ${error.message}`);
  }
};

const getStudentsInClass = async (classId) => {
  try {
    if (!classId) {
      throw new Error("Class ID is required");
    }
    
    const classData = await classRepository.getClassById(classId);
    if (!classData) {
      throw new Error("Class not found");
    }
    
    return await classRepository.getStudentsInClass(classId);
  } catch (error) {
    throw new Error(`Failed to fetch students in class: ${error.message}`);
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  getClassesByAcademicYear,
  getClassesByGradeLevel,
  createClass,
  updateClass,
  deleteClass,
  getStudentsInClass
};
