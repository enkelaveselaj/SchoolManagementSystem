import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import NotificationBanner from './components/NotificationBanner';
import notificationService from './services/notificationService';
import { useAuthStore } from './store/authStore';

export default function App() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const restoreToken = useAuthStore((s) => s.restoreToken);

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  useEffect(() => {
    if (!token || !user) return;

    try {
      notificationService.initializeSocket(token);
    } catch (e) {
      console.log('Socket init failed', e);
    }

    return () => {
      notificationService.disconnect();
    };
  }, [token, user]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <NotificationBanner />
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
