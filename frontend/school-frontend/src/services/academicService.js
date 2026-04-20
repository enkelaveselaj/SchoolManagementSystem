import axios from 'axios'

const API_BASE_URL = 'http://localhost:5003'

const academicService = {
  // Assessment functions
  getAllAssessments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assessments`)
      return response.data
    } catch (error) {
      console.error('Error fetching assessments:', error)
      throw error
    }
  },

  createAssessment: async (assessmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/assessments`, assessmentData)
      return response.data
    } catch (error) {
      console.error('Error creating assessment:', error)
      throw error
    }
  },

  updateAssessment: async (id, assessmentData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/assessments/${id}`, assessmentData)
      return response.data
    } catch (error) {
      console.error('Error updating assessment:', error)
      throw error
    }
  },

  deleteAssessment: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/assessments/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting assessment:', error)
      throw error
    }
  },

  // Grade functions
  getAllGrades: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/grades`)
      return response.data
    } catch (error) {
      console.error('Error fetching grades:', error)
      throw error
    }
  },

  calculateFinalGrade: async (studentId, subjectId, teacherId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/grades/calculate`, {
        studentId,
        subjectId,
        teacherId
      })
      return response.data
    } catch (error) {
      console.error('Error calculating final grade:', error)
      throw error
    }
  },

  manualUpdateGrade: async (studentId, subjectId, value) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/grades/manual-update`, {
        studentId,
        subjectId,
        value
      })
      return response.data
    } catch (error) {
      console.error('Error updating grade:', error)
      throw error
    }
  },

  // Attendance functions
  getAllAttendances: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attendances`)
      return response.data
    } catch (error) {
      console.error('Error fetching attendances:', error)
      throw error
    }
  },

  getAttendanceById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attendances/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching attendance:', error)
      throw error
    }
  },

  createAttendance: async (attendanceData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/attendances`, attendanceData)
      return response.data
    } catch (error) {
      console.error('Error creating attendance:', error)
      throw error
    }
  },

  updateAttendance: async (id, attendanceData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/attendances/${id}`, attendanceData)
      return response.data
    } catch (error) {
      console.error('Error updating attendance:', error)
      throw error
    }
  },

  deleteAttendance: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/attendances/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting attendance:', error)
      throw error
    }
  },

  // Subject functions
  getAllSubjects: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subjects`)
      return response.data
    } catch (error) {
      console.error('Error fetching subjects:', error)
      throw error
    }
  },

  getSubjectById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subjects/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching subject:', error)
      throw error
    }
  },

  createSubject: async (subjectData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subjects`, subjectData)
      return response.data
    } catch (error) {
      console.error('Error creating subject:', error)
      throw error
    }
  },

  updateSubject: async (id, subjectData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/subjects/${id}`, subjectData)
      return response.data
    } catch (error) {
      console.error('Error updating subject:', error)
      throw error
    }
  },

  deleteSubject: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/subjects/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting subject:', error)
      throw error
    }
  },

  // Timetable functions
  getAllTimetables: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/timetables`)
      return response.data
    } catch (error) {
      console.error('Error fetching timetables:', error)
      throw error
    }
  },

  getTimetableById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/timetables/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching timetable:', error)
      throw error
    }
  },

  createTimetable: async (timetableData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/timetables`, timetableData)
      return response.data
    } catch (error) {
      console.error('Error creating timetable:', error)
      throw error
    }
  },

  updateTimetable: async (id, timetableData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/timetables/${id}`, timetableData)
      return response.data
    } catch (error) {
      console.error('Error updating timetable:', error)
      throw error
    }
  },

  deleteTimetable: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/timetables/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting timetable:', error)
      throw error
    }
  },

  // Teacher-Subject Assignment functions
  getTeacherSubjects: async (teacherId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teacher-subjects/${teacherId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching teacher subjects:', error)
      throw error
    }
  },

  assignTeacherToSubject: async (teacherId, subjectId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/teacher-subjects`, {
        teacherId,
        subjectId
      })
      return response.data
    } catch (error) {
      console.error('Error assigning teacher to subject:', error)
      throw error
    }
  },

  removeTeacherFromSubject: async (teacherId, subjectId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/teacher-subjects/${teacherId}/${subjectId}`)
      return response.data
    } catch (error) {
      console.error('Error removing teacher from subject:', error)
      throw error
    }
  },

  getSubjectTeachers: async (subjectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subject-teachers/${subjectId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching subject teachers:', error)
      throw error
    }
  },

  // Enhanced Assessment functions for teacher workflow
  createAssessmentWithScores: async (assessmentData, studentScores) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/assessments/with-scores`, {
        assessment: assessmentData,
        scores: studentScores
      })
      return response.data
    } catch (error) {
      console.error('Error creating assessment with scores:', error)
      throw error
    }
  },

  getAssessmentWithScores: async (assessmentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assessments/${assessmentId}/with-scores`)
      return response.data
    } catch (error) {
      console.error('Error fetching assessment with scores:', error)
      throw error
    }
  },

  updateStudentAssessmentScore: async (assessmentId, studentId, score) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/assessments/${assessmentId}/scores/${studentId}`, {
        score
      })
      return response.data
    } catch (error) {
      console.error('Error updating student assessment score:', error)
      throw error
    }
  },

  // Enhanced Grade functions
  createOrUpdateGrade: async (gradeData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/grades/create-or-update`, gradeData)
      return response.data
    } catch (error) {
      console.error('Error creating or updating grade:', error)
      throw error
    }
  },

  getStudentGradesByClass: async (classId, sectionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/grades/class/${classId}/section/${sectionId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching student grades by class:', error)
      throw error
    }
  }
}

export default academicService
