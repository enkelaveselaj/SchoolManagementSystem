const axios = require('axios');

class AuthServiceClient {
  constructor() {
    this.teacherStudentServiceURL = process.env.TEACHER_STUDENT_SERVICE_URL || 'http://localhost:5004';
    this.authServiceURL = process.env.AUTH_SERVICE_URL || 'http://localhost:5002';

    this.teacherStudentClient = axios.create({
      baseURL: this.teacherStudentServiceURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.authClient = axios.create({
      baseURL: this.authServiceURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getStudents() {
    try {
      const response = await this.teacherStudentClient.get('/students');
      return response.data;
    } catch (error) {
      console.warn('Teacher-student service unavailable for getStudents:', error.message);
    }

    try {
      const response = await this.authClient.get('/admin/users/Student', {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_SERVICE_TOKEN || 'dummy-token'}`,
        },
      });
      return response.data;
    } catch (error) {
      console.warn('Auth service unavailable for getStudents:', error.message);
      return [];
    }
  }

  async getTeachers() {
    try {
      const response = await this.teacherStudentClient.get('/teachers');
      return response.data;
    } catch (error) {
      console.warn('Teacher-student service unavailable for getTeachers:', error.message);
    }

    try {
      const response = await this.authClient.get('/admin/users/Teacher', {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_SERVICE_TOKEN || 'dummy-token'}`,
        },
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
      const student = students.find(user => user.id == userId || user.studentId == userId);
      if (student) return { ...student, role: 'Student' };

      const teachers = await this.getTeachers();
      const teacher = teachers.find(user => user.id == userId || user.teacherId == userId);
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
