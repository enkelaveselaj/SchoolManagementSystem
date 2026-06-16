import { academicApi } from './api';

class AcademicService {
  async getSubjects() {
    try {
      const response = await academicApi.get('/subjects');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch subjects' };
    }
  }

  async createSubject(data) {
    try {
      const response = await academicApi.post('/subjects', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create subject' };
    }
  }

  async getAssessments(params) {
    try {
      const response = await academicApi.get('/assessments', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch assessments' };
    }
  }

  async createAssessment(data) {
    try {
      const response = await academicApi.post('/assessments', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create assessment' };
    }
  }

  async markAttendance(data) {
    try {
      const response = await academicApi.post('/attendance', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to mark attendance' };
    }
  }

  async getTimetables(params) {
    try {
      const response = await academicApi.get('/timetable', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch timetables' };
    }
  }

  async createTimetable(data) {
    try {
      const response = await academicApi.post('/timetable', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create timetable' };
    }
  }

  async getAssessmentScores(assessmentId) {
    try {
      const response = await academicApi.get(`/assessment-scores/assessment/${assessmentId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch scores' };
    }
  }

  async submitScore(data) {
    try {
      const response = await academicApi.post('/assessment-scores', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to submit score' };
    }
  }
}

export default new AcademicService();
