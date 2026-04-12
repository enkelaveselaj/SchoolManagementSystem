import axios from 'axios';

const API_BASE_URL = 'http://localhost:5004'; // Teacher-student microservice port

const teacherStudentService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
teacherStudentService.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
teacherStudentService.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Student API endpoints
export const studentAPI = {
  // Get all students
  getAllStudents: () => teacherStudentService.get('/students'),
  
  // Get student by ID
  getStudentById: (id) => teacherStudentService.get(`/students/${id}`),
  
  // Get students by class
  getStudentsByClass: (classId) => teacherStudentService.get(`/students/class/${classId}`),
  
  // Get students by section
  getStudentsBySection: (sectionId) => teacherStudentService.get(`/students/section/${sectionId}`),
  
  // Create new student
  createStudent: (studentData) => teacherStudentService.post('/students', studentData),
  
  // Update student
  updateStudent: (id, studentData) => teacherStudentService.put(`/students/${id}`, studentData),
  
  // Delete student
  deleteStudent: (id) => teacherStudentService.delete(`/students/${id}`),
  
  // Search students
  searchStudents: (query) => teacherStudentService.get(`/students/search?q=${query}`),
};

// Teacher API endpoints
export const teacherAPI = {
  // Get all teachers
  getAllTeachers: () => teacherStudentService.get('/teachers'),
  
  // Get teacher by ID
  getTeacherById: (id) => teacherStudentService.get(`/teachers/${id}`),
  
  // Create new teacher
  createTeacher: (teacherData) => teacherStudentService.post('/teachers', teacherData),
  
  // Update teacher
  updateTeacher: (id, teacherData) => teacherStudentService.put(`/teachers/${id}`, teacherData),
  
  // Delete teacher
  deleteTeacher: (id) => teacherStudentService.delete(`/teachers/${id}`),
  
  // Assign teacher to class
  assignTeacherToClass: (teacherId, classId) => teacherStudentService.post(`/teachers/${teacherId}/assign/${classId}`),
  
  // Get teacher's classes
  getTeacherClasses: (teacherId) => teacherStudentService.get(`/teachers/${teacherId}/classes`),
  
  // Search teachers
  searchTeachers: (query) => teacherStudentService.get(`/teachers/search?q=${query}`),
};

// Combined API endpoints
export const combinedAPI = {
  // Get school statistics
  getSchoolStats: () => teacherStudentService.get('/api/stats'),
  
  // Get class assignments
  getClassAssignments: () => teacherStudentService.get('/api/assignments'),
  
  // Bulk operations
  bulkCreateStudents: (studentsData) => teacherStudentService.post('/api/students/bulk', studentsData),
  bulkCreateTeachers: (teachersData) => teacherStudentService.post('/api/teachers/bulk', teachersData),
};

export default {
  studentAPI,
  teacherAPI,
  combinedAPI,
};
