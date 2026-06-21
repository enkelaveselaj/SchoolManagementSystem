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
      // Use the batch marking endpoint
      const response = await academicApi.post('/attendance/mark', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to mark attendance' };
    }
  }

  async getClassAttendance(classId, date, subjectId = null) {
    try {
      const response = await academicApi.get(`/attendance/class/${classId}`, {
        params: { date, subjectId }
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch attendance' };
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
      // Map mobile app fields to backend expected fields
      const payload = {
        ...data,
        gradeId: parseInt(data.classId),
        day: data.dayOfWeek,
        subjectId: parseInt(data.subjectId),
        teacherId: parseInt(data.teacherId) || null,
        sectionId: parseInt(data.sectionId) || null
      };

      const response = await academicApi.post('/timetable', payload);
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
      // data: { assessmentId, scores: [{ studentId, score, remarks }] }
      const response = await academicApi.post('/assessment-scores/batch', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to submit score' };
    }
  }
}

export default new AcademicService();
