import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/student/DashboardScreen';
import GradesScreen from '../screens/student/GradesScreen';
import AttendanceScreen from '../screens/student/AttendanceScreen';
const Tab = createBottomTabNavigator();
export default function StudentNavigator(){
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Grades" component={GradesScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
    </Tab.Navigator>
  );
}

