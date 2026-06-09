import { academicApi as api } from './api';

class AcademicService {
  async getSubjects() {
    try {
      const response = await api.get('/subjects');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch subjects' };
    }
  }

  async createSubject(data) {
    try {
      const response = await api.post('/subjects', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create subject' };
    }
  }

  async getAssessments(params) {
    try {
      const response = await api.get('/assessments', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch assessments' };
    }
  }

  async createAssessment(data) {
    try {
      const response = await api.post('/assessments', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create assessment' };
    }
  }

  async markAttendance(data) {
    try {
      const response = await api.post('/attendance', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to mark attendance' };
    }
  }
}

export default new AcademicService();
