import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import NotificationBanner from './components/NotificationBanner';
import notificationService from './services/notificationService';
import pushNotificationService from './services/pushNotificationService';
import { useAuthStore } from './store/authStore';

export default function App(){
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const restoreToken = useAuthStore((s) => s.restoreToken);

  // Restore token on mount
  useEffect(() => {
    restoreToken();
  }, []);

  // Initialize notifications when token and user are available
  useEffect(() => {
    let mounted = true;

    const initNotifications = async () => {
      if (!token || !user) return;

      // Initialize socket connection with auth token
      notificationService.initializeSocket(token);

      // Request push permissions and register expo push token with backend
      try {
        const ok = await pushNotificationService.requestPermissions();
        if (!ok) return;
        const pushToken = await pushNotificationService.getPushToken();
        if (pushToken && mounted) {
          await pushNotificationService.registerToken(user.id, pushToken);
        }
      } catch (e) {
        console.warn('Push notification init failed', e);
      }
    };

    initNotifications();

    return () => {
      mounted = false;
      notificationService.disconnect();
      if (pushNotificationService.cleanupNotificationHandlers) {
        pushNotificationService.cleanupNotificationHandlers();
      }
    };
  }, [token, user]);

  return (
    <NavigationContainer>
      <StatusBar />
      <NotificationBanner />
      <RootNavigator />
    </NavigationContainer>
  );
}
