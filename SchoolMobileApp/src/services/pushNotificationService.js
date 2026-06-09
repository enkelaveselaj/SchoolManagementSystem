import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

class PushNotificationService {
  async requestPermissions() {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token');
      return null;
    }

    return true;
  }

  async getPushToken() {
    try {
      if (!Device.isDevice) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      return token.data;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }

  async registerToken(userId, token) {
    try {
      const api = (await import('../services/api')).default;
      await api.post('/notifications/register-token', { userId, token });
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  }

  setupNotificationHandlers() {
    // Notification received while app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
    });

    // Notification tapped
    this.notificationResponseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { notification } = response;
        console.log('Notification tapped:', notification);
        // Handle notification tap - navigate to relevant screen
      });

    // Last notification received while app was closed
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response?.notification) {
        console.log('App opened from notification:', response.notification);
      }
    });
  }

  cleanupNotificationHandlers() {
    if (this.notificationResponseSubscription) {
      Notifications.removeNotificationSubscription(
        this.notificationResponseSubscription
      );
    }
  }

  async sendLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Immediately
    });
  }
}

export default new PushNotificationService();

