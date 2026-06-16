import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/student/DashboardScreen';
import GradesScreen from '../screens/student/GradesScreen';
import AttendanceScreen from '../screens/student/AttendanceScreen';
import StudentTimetableScreen from '../screens/student/StudentTimetableScreen';
import StudentAssessmentsScreen from '../screens/student/StudentAssessmentsScreen';
import AnnouncementsScreen from '../screens/student/AnnouncementsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { colors } from '../styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function StudentHomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="StudentDashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Grades" component={GradesScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Timetable" component={StudentTimetableScreen} />
      <Stack.Screen name="Assessments" component={StudentAssessmentsScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
    </Stack.Navigator>
  );
}

export default function StudentNavigator(){
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={StudentHomeStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

