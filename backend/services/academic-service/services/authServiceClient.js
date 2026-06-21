const axios = require('axios');

class AuthServiceClient {
  constructor() {
    // Port 5004 for Teacher-Student domain data, 5001 for Auth login data
    this.teacherStudentServiceURL = process.env.TEACHER_STUDENT_SERVICE_URL || 'http://localhost:5004';

    this.teacherStudentClient = axios.create({
      baseURL: this.teacherStudentServiceURL,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Translates a Login UserID to a Domain StudentID
   */
  async getStudentIdByUserId(userId) {
    if (!userId) return null;
    try {
      const response = await this.teacherStudentClient.get(`/students`);
      const students = response.data;
      // Find student record where either the ID or the linked UserId matches
      const student = students.find(s => s.userId == userId || s.id == userId);

      const resolvedId = student ? student.id : userId;
      console.log(`[ID Resolver] Mapped UserId ${userId} to StudentId ${resolvedId}`);
      return resolvedId;
    } catch (error) {
      console.warn('ID Resolver Warning:', error.message);
      return userId;
    }
  }

  async getTeacherIdByUserId(userId) {
    if (!userId) return null;
    try {
      const response = await this.teacherStudentClient.get(`/teachers`);
      const teachers = response.data;
      const teacher = teachers.find(t => t.userId == userId || t.id == userId);
      return teacher ? teacher.id : userId;
    } catch (error) {
      return userId;
    }
  }
}

module.exports = new AuthServiceClient();
