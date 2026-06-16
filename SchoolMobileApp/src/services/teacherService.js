import { teacherStudentApi as api } from './api';

class TeacherService {
  async getTeachers() {
    try {
      const response = await api.get('/teachers');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch teachers' };
    }
  }

  async getTeacherByUserId(userId) {
    try {
      const response = await api.get(`/teachers/user/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch teacher profile' };
    }
  }

  async getTeacherClasses(teacherId) {
    try {
      const response = await api.get(`/teachers/${teacherId}/classes`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch teacher classes' };
    }
  }

  async assignTeacherToSubject(teacherId, subjectId, classId = null) {
    try {
      const response = await api.post(`/teachers/${teacherId}/subjects/${subjectId}`, { classId });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to assign teacher' };
    }
  }
}

export default new TeacherService();
