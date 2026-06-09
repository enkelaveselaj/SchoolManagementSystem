import { authApi as api } from './api';

class AdminService {
  async createUser(userData) {
    try {
      const response = await api.post('/admin/create-user', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create user' };
    }
  }

  async createTeacher(teacherData) {
    try {
      const response = await api.post('/admin/create-teacher', teacherData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create teacher' };
    }
  }

  async getParents() {
    try {
      const response = await api.get('/admin/parents');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch parents' };
    }
  }

  async assignParentStudents(parentId, studentIds) {
    try {
      const response = await api.post(`/admin/parents/${parentId}/assign`, { studentIds });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to assign students' };
    }
  }
}

export default new AdminService();
