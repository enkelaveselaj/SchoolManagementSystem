import { schoolApi as api } from './api';

class SchoolService {
  async getSchools() {
    try {
      const response = await api.get('/school');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch schools' };
    }
  }

  async getClasses() {
    try {
      const response = await api.get('/classes');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch classes' };
    }
  }

  async createClass(classData) {
    try {
      const response = await api.post('/classes', classData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create class' };
    }
  }

  async getSections() {
    try {
      const response = await api.get('/sections');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch sections' };
    }
  }

  async createSection(data) {
    try {
      const response = await api.post('/sections', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create section' };
    }
  }

  async getAcademicYears() {
    try {
      const response = await api.get('/academic-years');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch academic years' };
    }
  }

  async createAcademicYear(data) {
    try {
      const response = await api.post('/academic-years', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create academic year' };
    }
  }
}

export default new SchoolService();
