import { teacherStudentApi as api } from './api';

class StudentManagementService {
  async getAllStudents() {
    try {
      const response = await api.get('/students');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch students' };
    }
  }

  async getStudentsBySection(sectionId) {
    try {
      const response = await api.get(`/students/section/${sectionId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch students' };
    }
  }

  async getStudentsByClass(classId) {
    try {
      const response = await api.get(`/students/class/${classId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch students by class' };
    }
  }

  async updateStudent(id, data) {
    try {
      const response = await api.put(`/students/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update student' };
    }
  }

  async createStudent(data) {
    try {
      const response = await api.post('/students', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create student' };
    }
  }
}

export default new StudentManagementService();
