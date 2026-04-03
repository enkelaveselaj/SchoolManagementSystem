const axios = require('axios');

class AuthServiceClient {
  constructor() {
    this.baseURL = process.env.AUTH_SERVICE_URL || 'http://localhost:5002';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getStudents() {
    try {
      const response = await this.client.get('/admin/users/Student', {
        headers: {
          'Authorization': `Bearer ${process.env.AUTH_SERVICE_TOKEN || 'dummy-token'}`
        }
      });
      return response.data;
    } catch (error) {
      console.warn('Auth service unavailable for getStudents:', error.message);
      return [];
    }
  }

  async getTeachers() {
    try {
      const response = await this.client.get('/admin/users/Teacher', {
        headers: {
          'Authorization': `Bearer ${process.env.AUTH_SERVICE_TOKEN || 'dummy-token'}`
        }
      });
      return response.data;
    } catch (error) {
      console.warn('Auth service unavailable for getTeachers:', error.message);
      return [];
    }
  }

  async getUserById(userId) {
    try {
      const students = await this.getStudents();
      const student = students.find(user => user.id == userId);
      if (student) return { ...student, role: 'Student' };

      const teachers = await this.getTeachers();
      const teacher = teachers.find(user => user.id == userId);
      if (teacher) return { ...teacher, role: 'Teacher' };

      throw new Error('User not found');
    } catch (error) {
      console.warn('Cannot validate user with auth service:', error.message);
      return { id: userId, role: 'Unknown', first_name: 'Unknown', last_name: 'User', email: 'unknown@example.com' };
    }
  }

  async validateUser(userId, expectedRole) {
    try {
      const user = await this.getUserById(userId);
      if (user.role !== expectedRole) {
        throw new Error(`User is not a ${expectedRole}`);
      }
      return user;
    } catch (error) {
      console.warn('User validation failed:', error.message);
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Allowing operation in development mode without auth validation');
        return { id: userId, role: expectedRole, first_name: 'Dev', last_name: 'User', email: 'dev@example.com' };
      }
      throw error;
    }
  }
}

module.exports = new AuthServiceClient();
