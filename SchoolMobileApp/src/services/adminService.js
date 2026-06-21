import { authApi, teacherStudentApi } from './api';

class AdminService {
  async createUser(userData) {
    try {
      const response = await authApi.post('/admin/create-user', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create user' };
    }
  }

  async createTeacher(teacherData) {
    try {
      const response = await authApi.post('/admin/create-teacher', teacherData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create teacher' };
    }
  }

  async getParents() {
    try {
      const response = await authApi.get('/admin/parents');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch parents' };
    }
  }

  async getTeachers() {
    try {
      const response = await teacherStudentApi.get('/teachers');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch teachers' };
    }
  }

  async getStudents() {
    try {
      const response = await teacherStudentApi.get('/students');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch students' };
    }
  }

  async assignParentStudents(parentId, studentIds) {
    try {
      const response = await authApi.post(`/admin/parents/${parentId}/assign`, { studentIds });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to assign students' };
    }
  }

  async deleteUser(userId) {
    try {
      const response = await authApi.delete(`/admin/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to delete user' };
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await authApi.put(`/admin/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update user' };
    }
  }
}

export default new AdminService();
