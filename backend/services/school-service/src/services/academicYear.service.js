const academicYearRepository = require("../repositories/academicYear.repository");

const getAllAcademicYears = async () => {
  try {
    return await academicYearRepository.getAllAcademicYears();
  } catch (error) {
    throw new Error(`Failed to fetch academic years: ${error.message}`);
  }
};

const getAcademicYearById = async (id) => {
  try {
    const academicYear = await academicYearRepository.getAcademicYearById(id);
    if (!academicYear) {
      throw new Error("Academic year not found");
    }
    return academicYear;
  } catch (error) {
    throw new Error(`Failed to fetch academic year: ${error.message}`);
  }
};

const createAcademicYear = async (academicYearData) => {
  try {
    const { name, startYear, endYear } = academicYearData;
    
    // Validate input
    if (!name || !startYear || !endYear) {
      throw new Error("Name, start year, and end year are required");
    }
    
    if (endYear <= startYear) {
      throw new Error("End year must be greater than start year");
    }
    
    // Check if academic year with same name already exists
    const existingYears = await academicYearRepository.getAllAcademicYears();
    const duplicate = existingYears.find(year => year.name === name);
    if (duplicate) {
      throw new Error("Academic year with this name already exists");
    }
    
    return await academicYearRepository.createAcademicYear(academicYearData);
  } catch (error) {
    throw new Error(`Failed to create academic year: ${error.message}`);
  }
};

const updateAcademicYear = async (id, academicYearData) => {
  try {
    const existingYear = await academicYearRepository.getAcademicYearById(id);
    if (!existingYear) {
      throw new Error("Academic year not found");
    }
    
    const { name, startYear, endYear } = academicYearData;
    
    // Validate input
    if (endYear <= startYear) {
      throw new Error("End year must be greater than start year");
    }
    
    const success = await academicYearRepository.updateAcademicYear(id, academicYearData);
    if (!success) {
      throw new Error("Failed to update academic year");
    }
    
    return await academicYearRepository.getAcademicYearById(id);
  } catch (error) {
    throw new Error(`Failed to update academic year: ${error.message}`);
  }
};

const deleteAcademicYear = async (id) => {
  try {
    const existingYear = await academicYearRepository.getAcademicYearById(id);
    if (!existingYear) {
      throw new Error("Academic year not found");
    }
    
    // Check if it's the current academic year
    if (existingYear.is_current) {
      throw new Error("Cannot delete the current academic year");
    }
    
    // Check if there are any classes associated with this academic year
    // This would require additional logic to check class table
    // For now, we'll proceed with deletion
    
    const success = await academicYearRepository.deleteAcademicYear(id);
    if (!success) {
      throw new Error("Failed to delete academic year");
    }
    
    return true;
  } catch (error) {
    throw new Error(`Failed to delete academic year: ${error.message}`);
  }
};

const getCurrentAcademicYear = async () => {
  try {
    const currentYear = await academicYearRepository.getCurrentAcademicYear();
    if (!currentYear) {
      throw new Error("No current academic year set");
    }
    return currentYear;
  } catch (error) {
    throw new Error(`Failed to fetch current academic year: ${error.message}`);
  }
};

const setCurrentAcademicYear = async (id) => {
  try {
    const existingYear = await academicYearRepository.getAcademicYearById(id);
    if (!existingYear) {
      throw new Error("Academic year not found");
    }
    
    const success = await academicYearRepository.setCurrentAcademicYear(id);
    if (!success) {
      throw new Error("Failed to set current academic year");
    }
    
    return await academicYearRepository.getAcademicYearById(id);
  } catch (error) {
    throw new Error(`Failed to set current academic year: ${error.message}`);
  }
};

module.exports = {
  getAllAcademicYears,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  getCurrentAcademicYear,
  setCurrentAcademicYear
};
