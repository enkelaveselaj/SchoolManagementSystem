import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import TeacherClassesScreen from '../screens/teacher/TeacherClassesScreen';
import TeacherAssessmentScreen from '../screens/teacher/TeacherAssessmentScreen';
import TeacherMarkAttendanceScreen from '../screens/teacher/TeacherMarkAttendanceScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { colors } from '../styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TeacherHomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TeacherClasses"
        component={TeacherClassesScreen}
        options={{ title: 'My Classes' }}
      />
      <Stack.Screen
        name="TeacherAssessments"
        component={TeacherAssessmentScreen}
        options={{ title: 'Manage Assessments' }}
      />
      <Stack.Screen
        name="MarkAttendance"
        component={TeacherMarkAttendanceScreen}
        options={{ title: 'Mark Attendance' }}
      />
    </Stack.Navigator>
  );
}

export default function TeacherNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={TeacherHomeStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
