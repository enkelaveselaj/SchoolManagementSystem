import { academicApi as api } from './api';

class StudentService {
  async getDashboard(studentId) {
    try {
      const response = await api.get(`/api/dashboard/student/${studentId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch dashboard';
      return { success: false, error: errorMessage };
    }
  }

  async getGrades(studentId, filter = {}) {
    try {
      const response = await api.get(`/grades`, {
        params: { studentId, ...filter },
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch grades';
      return { success: false, error: errorMessage };
    }
  }

  async getAttendance(studentId, dateRange = {}) {
    try {
      const response = await api.get(
        `/attendance/student/${studentId}`,
        { params: dateRange }
      );
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch attendance';
      return { success: false, error: errorMessage };
    }
  }

  async getAttendanceStats(studentId) {
    try {
      const response = await api.get(
        `/attendance/student/${studentId}/stats`
      );
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch attendance stats';
      return { success: false, error: errorMessage };
    }
  }

  async getTimetable(studentId) {
    try {
      const response = await api.get(`/timetable`, {
        params: { studentId },
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch timetable';
      return { success: false, error: errorMessage };
    }
  }
}

export default new StudentService();

