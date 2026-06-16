import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import NotificationBanner from './components/NotificationBanner';
import notificationService from './services/notificationService';
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
    if (!token || !user) return;

    // Initialize socket connection with auth token
    try {
      notificationService.initializeSocket(token);
    } catch (e) {
      console.log('Socket init failed');
    }

    return () => {
      notificationService.disconnect();
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
