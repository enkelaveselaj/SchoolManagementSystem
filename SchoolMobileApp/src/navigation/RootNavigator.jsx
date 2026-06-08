import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import { useAuthStore } from '../store/authStore';
const Stack = createStackNavigator();
export default function RootNavigator(){
  const isLoggedIn = useAuthStore(state=>state.isLoggedIn);
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      {isLoggedIn ? (
        <Stack.Screen name="App" component={StudentNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

