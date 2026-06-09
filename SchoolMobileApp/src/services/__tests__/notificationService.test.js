import notificationService from '../notificationService';
import socketService from '../socketService';

jest.mock('../socketService');

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    socketService.connect = jest.fn();
    socketService.on = jest.fn();
  });

  test('initializeSocket connects and sets up listeners', () => {
    notificationService.initializeSocket('test-token');

    expect(socketService.connect).toHaveBeenCalledWith('test-token');
  });

  test('on registers event listener', () => {
    const callback = jest.fn();
    notificationService.on('announcement', callback);

    // Emit the same event
    notificationService.emit('announcement', { title: 'Test' });

    expect(callback).toHaveBeenCalledWith({ title: 'Test' });
  });

  test('off removes event listener', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    notificationService.on('announcement', callback1);
    notificationService.on('announcement', callback2);
    notificationService.off('announcement', callback1);

    notificationService.emit('announcement', { title: 'Test' });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  test('emit triggers all listeners for event', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    notificationService.on('grade_posted', callback1);
    notificationService.on('grade_posted', callback2);

    notificationService.emit('grade_posted', { grade: 9 });

    expect(callback1).toHaveBeenCalledWith({ grade: 9 });
    expect(callback2).toHaveBeenCalledWith({ grade: 9 });
  });
});

