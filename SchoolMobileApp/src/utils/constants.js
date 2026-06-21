import { Platform } from 'react-native';

// Use localhost for web browser, and the IP for physical phones
const CURRENT_IP = '192.168.1.18';
const BASE_HOST = Platform.OS === 'web' ? 'localhost' : CURRENT_IP;

export const AUTH_SERVICE_URL = `http://${BASE_HOST}:5001`;
export const SCHOOL_SERVICE_URL = `http://${BASE_HOST}:5002`;
export const ACADEMIC_SERVICE_URL = `http://${BASE_HOST}:5003`;
export const TEACHER_STUDENT_SERVICE_URL = `http://${BASE_HOST}:5004`;
export const REAL_TIME_SERVICE_URL = `http://${BASE_HOST}:5005`;
export const SOCKET_URL = `http://${BASE_HOST}:5005`;

export const STORAGE_KEYS = { TOKEN: '@auth_token', USER: '@user_data' };
