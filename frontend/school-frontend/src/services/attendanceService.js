const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

class AttendanceService {
  // Mark attendance for multiple students
  async markAttendance(attendanceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark attendance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  // Get attendance for a specific class and date
  async getClassAttendance(classId, date, subjectId = null) {
    try {
      let url = `${API_BASE_URL}/attendance/class/${classId}?date=${date}`;
      if (subjectId) {
        url += `&subjectId=${subjectId}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get class attendance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting class attendance:', error);
      throw error;
    }
  }

  // Get attendance for a specific student
  async getStudentAttendance(studentId, startDate = null, endDate = null) {
    try {
      let url = `${API_BASE_URL}/attendance/student/${studentId}`;
      const params = new URLSearchParams();

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get student attendance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting student attendance:', error);
      throw error;
    }
  }

  // Get attendance statistics for a class
  async getClassAttendanceStats(classId, startDate = null, endDate = null) {
    try {
      let url = `${API_BASE_URL}/attendance/class/${classId}/stats`;
      const params = new URLSearchParams();

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get class attendance statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting class attendance stats:', error);
      throw error;
    }
  }

  // Get attendance statistics for a student
  async getStudentAttendanceStats(studentId, startDate = null, endDate = null) {
    try {
      let url = `${API_BASE_URL}/attendance/student/${studentId}/stats`;
      const params = new URLSearchParams();

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get student attendance statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting student attendance stats:', error);
      throw error;
    }
  }

  // Get attendance report with filters
  async getAttendanceReport(filters = {}) {
    try {
      const params = new URLSearchParams();

      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          if (Array.isArray(filters[key])) {
            params.append(key, filters[key].join(','));
          } else {
            params.append(key, filters[key]);
          }
        }
      });

      let url = `${API_BASE_URL}/attendance/report`;
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get attendance report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting attendance report:', error);
      throw error;
    }
  }

  // Update attendance record
  async updateAttendance(attendanceId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${attendanceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update attendance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  // Delete attendance record
  async deleteAttendance(attendanceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${attendanceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete attendance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  }

  // Get attendance summary for dashboard
  async getAttendanceSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/summary`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get attendance summary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting attendance summary:', error);
      throw error;
    }
  }

  // Helper method to format date for API
  formatDateForAPI(date) {
    return new Date(date).toISOString().split('T')[0];
  }

  // Helper method to get today's date
  getTodayDate() {
    return this.formatDateForAPI(new Date());
  }

  // Helper method to get date range for last N days
  getLastNDays(days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    return {
      startDate: this.formatDateForAPI(startDate),
      endDate: this.formatDateForAPI(endDate)
    };
  }

  // Helper method to get date range for current month
  getCurrentMonthRange() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: this.formatDateForAPI(startDate),
      endDate: this.formatDateForAPI(endDate)
    };
  }

  // Helper method to get date range for current academic year
  getCurrentAcademicYearRange() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Academic year typically starts in August/September
    let startYear = currentYear;
    if (currentMonth < 8) {
      startYear = currentYear - 1;
    }

    const startDate = new Date(startYear, 8, 1); // September 1st
    const endDate = new Date(startYear + 1, 7, 31); // August 31st

    return {
      startDate: this.formatDateForAPI(startDate),
      endDate: this.formatDateForAPI(endDate)
    };
  }
}

export default new AttendanceService();
