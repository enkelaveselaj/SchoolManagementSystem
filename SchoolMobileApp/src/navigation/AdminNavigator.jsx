import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import CreateUserScreen from '../screens/admin/CreateUserScreen';
import AdminAcademicSetupScreen from '../screens/admin/AdminAcademicSetupScreen';
import AdminClassManagementScreen from '../screens/admin/AdminClassManagementScreen';
import AdminSectionManagementScreen from '../screens/admin/AdminSectionManagementScreen';
import AdminStudentEnrollmentScreen from '../screens/admin/AdminStudentEnrollmentScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { colors } from '../styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AdminHomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{ title: 'Manage Users' }}
      />
      <Stack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={{ title: 'Create New User' }}
      />
      <Stack.Screen
        name="AcademicSetup"
        component={AdminAcademicSetupScreen}
        options={{ title: 'Academic Setup' }}
      />
      <Stack.Screen
        name="ClassManagement"
        component={AdminClassManagementScreen}
        options={{ title: 'Class Management' }}
      />
      <Stack.Screen
        name="SectionManagement"
        component={AdminSectionManagementScreen}
        options={{ title: 'Section Management' }}
      />
      <Stack.Screen
        name="StudentEnrollment"
        component={AdminStudentEnrollmentScreen}
        options={{ title: 'Student Enrollment' }}
      />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'grid' : 'grid-outline';
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
      <Tab.Screen name="Home" component={AdminHomeStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
