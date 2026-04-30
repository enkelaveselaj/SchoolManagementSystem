import axios from 'axios';

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5001';

const adminClient = axios.create({
  baseURL: `${AUTH_API_BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json'
  }
});

adminClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);

export const adminAPI = {
  createUser: (data) => adminClient.post('/create-user', data),
  getParents: () => adminClient.get('/parents'),
  assignParentStudents: (parentId, studentIds) =>
    adminClient.post(`/parents/${parentId}/assign`, { studentIds })
};

export default adminAPI;
