import axios from 'axios';

const MESSAGING_API_BASE_URL = import.meta.env.VITE_REALTIME_API_URL || 'http://localhost:5005';

const messagingClient = axios.create({
  baseURL: MESSAGING_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

messagingClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);

const messagingService = {
  getMessages: (room) => messagingClient.get('/messages', { params: { room } }),
  sendMessage: (payload) => messagingClient.post('/messages', payload),
  getNotifications: (params) => messagingClient.get('/notifications', { params }),
  markNotificationRead: (notificationId) => messagingClient.patch(`/notifications/${notificationId}/read`),
  createNotification: (payload) => messagingClient.post('/notifications', payload)
};

export default messagingService;
