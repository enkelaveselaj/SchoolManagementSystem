import axios from 'axios'

const API_BASE_URL = 'http://localhost:5002'

const schoolService = {
  getSchool: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/school`)
      return response.data
    } catch (error) {
      console.error('Error fetching school data:', error)
      throw error
    }
  },

  updateSchool: async (schoolData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/school`, schoolData)
      return response.data
    } catch (error) {
      console.error('Error updating school data:', error)
      throw error
    }
  },

  // Academic Year functions
  getAllAcademicYears: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/academic-years`)
      return response.data
    } catch (error) {
      console.error('Error fetching academic years:', error)
      throw error
    }
  },

  getAcademicYearById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/academic-years/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching academic year:', error)
      throw error
    }
  },

  createAcademicYear: async (academicYearData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/academic-years`, academicYearData)
      return response.data
    } catch (error) {
      console.error('Error creating academic year:', error)
      throw error
    }
  },

  updateAcademicYear: async (id, academicYearData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/academic-years/${id}`, academicYearData)
      return response.data
    } catch (error) {
      console.error('Error updating academic year:', error)
      throw error
    }
  },

  deleteAcademicYear: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/academic-years/${id}`)
    } catch (error) {
      console.error('Error deleting academic year:', error)
      throw error
    }
  },

  getCurrentAcademicYear: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/academic-years/current`)
      return response.data
    } catch (error) {
      console.error('Error fetching current academic year:', error)
      throw error
    }
  },

  setCurrentAcademicYear: async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/academic-years/${id}/current`)
      return response.data
    } catch (error) {
      console.error('Error setting current academic year:', error)
      throw error
    }
  },

  // Class functions
  getAllClasses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classes`)
      return response.data
    } catch (error) {
      console.error('Error fetching classes:', error)
      throw error
    }
  },

  getClassById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching class:', error)
      throw error
    }
  },

  createClass: async (classData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/classes`, classData)
      return response.data
    } catch (error) {
      console.error('Error creating class:', error)
      throw error
    }
  },

  updateClass: async (id, classData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/classes/${id}`, classData)
      return response.data
    } catch (error) {
      console.error('Error updating class:', error)
      throw error
    }
  },

  deleteClass: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/classes/${id}`)
    } catch (error) {
      console.error('Error deleting class:', error)
      throw error
    }
  },

  getClassesByFilters: async (academicYearId, gradeLevel) => {
    try {
      let url = `${API_BASE_URL}/classes`
      const params = []
      if (academicYearId) params.push(`academicYearId=${academicYearId}`)
      if (gradeLevel) params.push(`gradeLevel=${gradeLevel}`)
      if (params.length > 0) url += `?${params.join('&')}`
      
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      console.error('Error fetching classes by filters:', error)
      throw error
    }
  },

  // Section functions
  getAllSections: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sections`)
      return response.data
    } catch (error) {
      console.error('Error fetching sections:', error)
      throw error
    }
  },

  getSectionById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sections/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching section:', error)
      throw error
    }
  },

  createSection: async (sectionData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sections`, sectionData)
      return response.data
    } catch (error) {
      console.error('Error creating section:', error)
      throw error
    }
  },

  updateSection: async (id, sectionData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/sections/${id}`, sectionData)
      return response.data
    } catch (error) {
      console.error('Error updating section:', error)
      throw error
    }
  },

  deleteSection: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/sections/${id}`)
    } catch (error) {
      console.error('Error deleting section:', error)
      throw error
    }
  },

  getSectionsByClass: async (classId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sections?classId=${classId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching sections by class:', error)
      throw error
    }
  },

  // Student functions
  getAllStudents: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students`)
      return response.data
    } catch (error) {
      console.error('Error fetching students:', error)
      throw error
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching student:', error)
      throw error
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/students`, studentData)
      return response.data
    } catch (error) {
      console.error('Error creating student:', error)
      throw error
    }
  },

  updateStudent: async (id, studentData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/students/${id}`, studentData)
      return response.data
    } catch (error) {
      console.error('Error updating student:', error)
      throw error
    }
  },

  deleteStudent: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/students/${id}`)
    } catch (error) {
      console.error('Error deleting student:', error)
      throw error
    }
  },

  getStudentsByClass: async (classId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students?classId=${classId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching students by class:', error)
      throw error
    }
  }
}

export default schoolService
