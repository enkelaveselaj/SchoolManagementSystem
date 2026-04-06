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
  }
}

export default schoolService
