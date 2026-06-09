import api from './api';

class AssessmentService {
  async getAssessments(studentId, filter = {}) {
    try {
      const response = await api.get(`/assessments`, {
        params: { studentId, ...filter },
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch assessments';
      return { success: false, error: errorMessage };
    }
  }

  async getAssessmentDetails(assessmentId) {
    try {
      const response = await api.get(`/assessments/${assessmentId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch assessment details';
      return { success: false, error: errorMessage };
    }
  }

  async submitAssessment(assessmentId, submissionData) {
    try {
      const response = await api.post(`/assessments/${assessmentId}/submit`, submissionData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit assessment';
      return { success: false, error: errorMessage };
    }
  }
}

export default new AssessmentService();

