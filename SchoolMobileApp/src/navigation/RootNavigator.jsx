import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import AdminNavigator from './AdminNavigator';
import TeacherNavigator from './TeacherNavigator';
import { useAuthStore } from '../store/authStore';

const Stack = createStackNavigator();

export default function RootNavigator(){
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const user = useAuthStore(state => state.user);

  const getAppNavigator = () => {
    switch (user?.role) {
      case 'Admin':
        return AdminNavigator;
      case 'Teacher':
        return TeacherNavigator;
      case 'Student':
      default:
        return StudentNavigator;
    }
  };

  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      {isLoggedIn ? (
        <Stack.Screen name="App" component={getAppNavigator()} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

