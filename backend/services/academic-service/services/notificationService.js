const axios = require('axios');

const REALTIME_API_URL = process.env.REALTIME_API_URL || 'http://localhost:5005';

class NotificationService {
  async createNotification(data) {
    try {
      const response = await axios.post(`${REALTIME_API_URL}/notifications`, {
        title: data.title,
        message: data.message,
        targetRole: data.targetRole || 'student',
        targetEmail: data.targetEmail || '',
        type: data.type || 'general',
        link: data.link || ''
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create notification:', error.message);
      // Don't throw - notifications shouldn't break the main operation
      return null;
    }
  }

  async notifyStudentGradePosted(studentEmail, subjectName, grade) {
    return this.createNotification({
      title: 'Grade Posted',
      message: `Your grade for ${subjectName} has been posted: ${grade}/10`,
      targetEmail: studentEmail,
      targetRole: 'student',
      type: 'grade'
    });
  }

  async notifyStudentAttendanceMarked(studentEmail, date, status) {
    return this.createNotification({
      title: 'Attendance Recorded',
      message: `Your attendance for ${date} has been marked as ${status}`,
      targetEmail: studentEmail,
      targetRole: 'student',
      type: 'attendance'
    });
  }

  async notifyStudentAssessmentCreated(studentEmail, assessmentName, dueDate) {
    return this.createNotification({
      title: 'New Assessment',
      message: `A new assessment "${assessmentName}" has been created. Due: ${dueDate}`,
      targetEmail: studentEmail,
      targetRole: 'student',
      type: 'assessment'
    });
  }

  async notifyStudentAssessmentScored(studentEmail, assessmentName, score, maxScore) {
    return this.createNotification({
      title: 'Assessment Scored',
      message: `Your score for ${assessmentName} is ${score}/${maxScore}.`,
      targetEmail: studentEmail,
      targetRole: 'student',
      type: 'assessment-score'
    });
  }

  async notifyClassAnnouncement(announcement, targetRole = 'student') {
    return this.createNotification({
      title: announcement.title || 'Announcement',
      message: announcement.message,
      targetRole: targetRole,
      type: 'announcement',
      link: announcement.link || ''
    });
  }
}

module.exports = new NotificationService();
