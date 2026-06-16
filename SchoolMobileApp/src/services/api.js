import axios from 'axios';
import {
  AUTH_SERVICE_URL,
  SCHOOL_SERVICE_URL,
  ACADEMIC_SERVICE_URL,
  TEACHER_STUDENT_SERVICE_URL,
  REAL_TIME_SERVICE_URL
} from '../utils/constants';
import { useAuthStore } from '../store/authStore';

const createInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
  });

  // Add a request interceptor to include the auth token
  instance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor for debugging and unwrapping
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};

export const authApi = createInstance(AUTH_SERVICE_URL);
export const schoolApi = createInstance(SCHOOL_SERVICE_URL);
export const academicApi = createInstance(ACADEMIC_SERVICE_URL);
export const teacherStudentApi = createInstance(TEACHER_STUDENT_SERVICE_URL);
export const realTimeApi = createInstance(REAL_TIME_SERVICE_URL);

// For backward compatibility
const api = authApi;
export default api;
