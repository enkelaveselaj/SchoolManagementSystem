import socketService from './socketService';

class NotificationService {
  constructor() {
    this.listeners = {};
  }

  initializeSocket(token) {
    socketService.connect(token);
    this.setupListeners();
  }

  setupListeners() {
    // Listen for announcements
    socketService.on('announcement', (data) => {
      this.emit('announcement', data);
    });

    // Listen for grade notifications
    socketService.on('grade_posted', (data) => {
      this.emit('grade_posted', data);
    });

    // Listen for attendance notifications
    socketService.on('attendance_updated', (data) => {
      this.emit('attendance_updated', data);
    });

    // Listen for assessment notifications
    socketService.on('assessment_available', (data) => {
      this.emit('assessment_available', data);
    });

    socketService.on('assessment_graded', (data) => {
      this.emit('assessment_graded', data);
    });
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        callback(data);
      });
    }
  }

  disconnect() {
    socketService.disconnect();
  }
}

export default new NotificationService();

