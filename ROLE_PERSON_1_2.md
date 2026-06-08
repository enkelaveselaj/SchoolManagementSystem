# Mobile App Development - Individual Role Guide

## 👤 PERSON 1: Backend Extensions & API Integration
### Role: Backend Developer / DevOps

---

### 📋 EXACT TASKS (In Order)

#### Task 1: Add Forgot Password Functionality (2-3 hours)

**File to modify:** `backend/services/auth-service/routes/authRoute.js`

Add these routes:
```javascript
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
```

**File to create:** `backend/services/auth-service/controllers/passwordResetController.js`

Functions needed:
- `forgotPassword(req, res)` - Generates token, sends email
- `resetPassword(req, res)` - Validates token, updates password

**Details:**
- Generate random token (use crypto)
- Store token in database (add token column to users table)
- Store token expiry (15 minutes)
- Send email via NodeMailer (free alternative: just log for testing)
- Validate token format
- Hash new password with bcrypt

**Test it:**
```bash
POST http://localhost:5001/auth/forgot-password
Body: { "email": "student@school.com" }

Response: { "message": "Reset email sent", "token": "xxx" }

POST http://localhost:5001/auth/reset-password/xxx
Body: { "newPassword": "newPass123" }
```

---

#### Task 2: Create Dashboard Endpoint (1-2 hours)

**File to create:** `backend/services/academic-service/routes/dashboard.js`

Route:
```javascript
router.get("/student/:studentId", getDashboardData);
```

**Response format (critical for mobile):**
```json
{
  "studentId": 123,
  "name": "John Doe",
  "attendancePercentage": 92.5,
  "averageGrade": 8.2,
  "recentGrades": [
    {
      "subject": "Mathematics",
      "grade": 9,
      "date": "2024-05-15"
    },
    {
      "subject": "English",
      "grade": 8,
      "date": "2024-05-14"
    },
    {
      "subject": "Science",
      "grade": 8.5,
      "date": "2024-05-13"
    }
  ],
  "pendingAssessments": 3,
  "upcomingTimetable": [
    {
      "subject": "Mathematics",
      "time": "09:00 - 10:00",
      "room": 101
    }
  ],
  "latestAnnouncements": [
    {
      "title": "School Closure",
      "date": "2024-05-20"
    }
  ]
}
```

**Implementation:**
- Query grades table for last 3 grades
- Query attendance for percentage
- Query assessments for pending count
- Query timetable for today's classes
- Query announcements for latest 3

---

#### Task 3: Verify Email Endpoint (1 hour)

**File:** `backend/services/auth-service/controllers/authController.js`

Add function:
```javascript
verifyEmail(req, res) {
  // Receives email verification token
  // Marks email as verified in database
  // Returns success message
}
```

After signup, user gets temporary token to verify email.

---

#### Task 4: Update CORS Configuration (30 mins)

**File:** `backend/api-gateway/src/app.js`

Update CORS to allow mobile app:
```javascript
app.use(cors({
  origin: ["http://localhost:8081", "http://localhost:19000", "exp://127.0.0.1:8081"],
  credentials: true
}));
```

---

#### Task 5: Create API Documentation (1 hour)

**File to create:** `MOBILE_API_ENDPOINTS.md`

Document all endpoints the mobile team will use:
```markdown
# Mobile API Endpoints

## Base URL
Production: https://your-server.com
Development: http://localhost:5000

## Authentication
All requests include: Authorization: Bearer <token>

## Auth Endpoints
POST /auth/login
POST /auth/register
POST /auth/forgot-password
POST /auth/reset-password/:token

## Academic Endpoints
GET /grades?studentId=X
GET /attendance/student/:studentId
GET /assessments
GET /announcements

## Dashboard
GET /api/dashboard/student/:studentId
```

---

#### Task 6: Create Postman Collection (1 hour)

**File to create:** `School_Mobile_API.postman_collection.json`

Export your working API tests so mobile team can test immediately.

---

#### Task 7: Unit Tests for New Endpoints (2 hours)

Create test file: `backend/services/auth-service/tests/passwordReset.test.js`

Tests:
```javascript
test('Forgot password generates valid token')
test('Reset password with valid token updates password')
test('Reset password with expired token fails')
test('Email verification marks user as verified')
```

---

### 🔄 HANDOFF TO MOBILE TEAM

**What Person 1 delivers:**
- ✅ Updated auth routes (forgot password, reset, verify)
- ✅ Dashboard API endpoint
- ✅ Updated CORS config
- ✅ API documentation (.md file)
- ✅ Postman collection
- ✅ Test coverage for new endpoints

**Git commits:**
```bash
git add backend/services/auth-service/
git commit -m "feat: add forgot password and email verification"
git add backend/services/academic-service/
git commit -m "feat: add dashboard endpoint"
git push origin backend-extensions
```

**Communication to team:**
- Post the `MOBILE_API_ENDPOINTS.md` in team chat
- Share Postman collection
- Confirm all endpoints working on dev environment
- Be available for API questions during Week 2-3

---

### ⏰ TIMELINE FOR PERSON 1
- **Day 1-2**: Forgot password + reset password (2-3 hours)
- **Day 2**: Dashboard endpoint + tests (2 hours)  
- **Day 3**: Email verification + CORS (1 hour)
- **Day 3**: API documentation + Postman (2 hours)
- **Day 4-5**: Testing, bug fixes, availability for mobile team questions

**Total Time Commitment:** ~12 hours over 1 week
**Remaining Time:** Available to help mobile team with API integration questions

---

### 💾 DATABASE CHANGES NEEDED

If not already there, add to users table:
```sql
-- Add email verification columns
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN email_verification_token_expires DATETIME;

-- Add password reset columns
ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN password_reset_token_expires DATETIME;
```

---

### ✅ ACCEPTANCE CRITERIA

- [ ] All new endpoints return correct JSON format
- [ ] Forgot password sends (logs) email
- [ ] Reset password validates token expiry
- [ ] Dashboard endpoint includes all required fields
- [ ] CORS allows mobile app requests
- [ ] Postman collection successfully tests all endpoints
- [ ] Unit tests pass (90%+ coverage)
- [ ] Code committed to git with clear messages
- [ ] Mobile team can test endpoints on Day 3

---

---

## 👤 PERSON 2: Project Setup & Navigation Architecture
### Role: React Native Lead / Project Lead

---

### 📋 EXACT TASKS (In Order)

#### Task 1: Initialize Expo Project (30 mins)

```bash
# Create project
npx create-expo-app SchoolMobileApp

# Navigate into project
cd SchoolMobileApp

# Install core dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install @react-navigation/stack react-native-screens
npm install react-native-safe-area-context
npm install axios zustand @react-native-async-storage/async-storage
npm install expo-notifications
npm install react-native-push-notifications
npm install socket.io-client
npm install react-native-chart-kit

# Initialize git
git init
git remote add origin <your-repo-url>
git checkout -b mobile-app-development
git add .
git commit -m "Initialize React Native project with Expo"
git push origin mobile-app-development
```

---

#### Task 2: Set Up Project Folder Structure (1 hour)

Create this exact structure:

```
SchoolMobileApp/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── RegisterScreen.jsx
│   │   │   └── ForgotPasswordScreen.jsx
│   │   ├── student/
│   │   │   ├── DashboardScreen.jsx
│   │   │   ├── GradesScreen.jsx
│   │   │   ├── AttendanceScreen.jsx
│   │   │   ├── AssessmentsScreen.jsx
│   │   │   ├── AssessmentDetailScreen.jsx
│   │   │   ├── AnnouncementsScreen.jsx
│   │   │   └── SettingsScreen.jsx
│   │   └── LoadingScreen.jsx
│   ├── navigation/
│   │   ├── AuthNavigator.jsx
│   │   ├── StudentNavigator.jsx
│   │   └── RootNavigator.jsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── cards/
│   │   │   ├── GradeCard.jsx
│   │   │   ├── AttendanceCard.jsx
│   │   │   ├── AssessmentCard.jsx
│   │   │   └── AnnouncementCard.jsx
│   │   └── charts/
│   │       ├── AttendanceChart.jsx
│   │       └── GradesChart.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── studentService.js
│   │   ├── assessmentService.js
│   │   ├── notificationService.js
│   │   └── socketService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useStudent.js
│   │   └── useNotification.js
│   ├── store/
│   │   ├── authStore.js
│   │   └── studentStore.js
│   ├── styles/
│   │   ├── colors.js
│   │   ├── spacing.js
│   │   └── typography.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── formatters.js
│   └── App.jsx
├── app.json
├── eas.json (for app building)
├── .env
├── .env.example
├── package.json
└── package-lock.json
```

**Create .env file:**
```
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_SOCKET_URL=http://localhost:5005
EXPO_PUBLIC_ENV=development
```

**Create .env.example (for team):**
```
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_SOCKET_URL=http://localhost:5005
EXPO_PUBLIC_ENV=development
```

---

#### Task 3: Create Base Configuration Files (1.5 hours)

**File: `src/styles/colors.js`**
```javascript
export const colors = {
  // Primary
  primary: '#007AFF',
  primaryLight: '#E7F1FF',
  primaryDark: '#0051D5',
  
  // Secondary
  secondary: '#34C759',
  secondaryLight: '#E8F5E9',
  
  // Status
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#00B4D8',
  
  // Grades
  gradeA: '#34C759',
  gradeB: '#00B4D8',
  gradeC: '#FFB81C',
  gradeD: '#FF9500',
  gradeF: '#FF3B30',
  
  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F9FAFB',
  gray200: '#F3F4F6',
  gray300: '#E5E7EB',
  gray400: '#D1D5DB',
  gray500: '#9CA3AF',
  gray600: '#6B7280',
  gray700: '#4B5563',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Attendance
  present: '#34C759',
  absent: '#FF3B30',
  late: '#FF9500',
};

export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
};
```

**File: `src/styles/spacing.js`**
```javascript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};
```

**File: `src/utils/constants.js`**
```javascript
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5005';

export const STUDENT_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
};

export const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@user_data',
  STUDENT_ID: '@student_id',
};

export const NOTIFICATION_TYPES = {
  GRADE: 'grade',
  ATTENDANCE: 'attendance',
  ASSESSMENT: 'assessment',
  ANNOUNCEMENT: 'announcement',
};
```

---

#### Task 4: Create API Base Configuration (1 hour)

**File: `src/services/api.js`**
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      // Trigger logout in auth store (set in Person 3)
    }
    return Promise.reject(error);
  }
);

export default api;
```

**File: `src/store/authStore.js`**
```javascript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isLoggedIn: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    set({ user: null, token: null, isLoggedIn: false });
  },

  restoreToken: async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (token && user) {
        set({ token, user: JSON.parse(user), isLoggedIn: true });
      }
    } catch (e) {
      console.error('Failed to restore token:', e);
    }
  },
}));
```

---

#### Task 5: Create Navigation Structure (2 hours)

**File: `src/navigation/RootNavigator.jsx`**
```javascript
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import { colors } from '../styles/colors';

export default function RootNavigator() {
  const { isLoggedIn, restoreToken, isLoading, setIsLoading } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await restoreToken();
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, []);

  if (initializing || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <StudentNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
```

**File: `src/navigation/AuthNavigator.jsx`**
```javascript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { colors } from '../styles/colors';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
        cardStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </Stack.Navigator>
  );
}
```

**File: `src/navigation/StudentNavigator.jsx`**
```javascript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import DashboardScreen from '../screens/student/DashboardScreen';
import GradesScreen from '../screens/student/GradesScreen';
import AttendanceScreen from '../screens/student/AttendanceScreen';
import AssessmentsScreen from '../screens/student/AssessmentsScreen';
import AssessmentDetailScreen from '../screens/student/AssessmentDetailScreen';
import AnnouncementsScreen from '../screens/student/AnnouncementsScreen';
import SettingsScreen from '../screens/student/SettingsScreen';

import { colors } from '../styles/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="DashboardHome" component={DashboardScreen} options={{ title: 'Dashboard' }} />
    </Stack.Navigator>
  );
}

function GradesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="GradesHome" component={GradesScreen} options={{ title: 'My Grades' }} />
    </Stack.Navigator>
  );
}

function AttendanceStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="AttendanceHome" component={AttendanceScreen} options={{ title: 'Attendance' }} />
    </Stack.Navigator>
  );
}

function AssessmentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="AssessmentsHome" component={AssessmentsScreen} options={{ title: 'Assessments' }} />
      <Stack.Screen name="AssessmentDetail" component={AssessmentDetailScreen} options={{ title: 'Assessment Details' }} />
    </Stack.Navigator>
  );
}

function AnnouncementsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="AnnouncementsHome" component={AnnouncementsScreen} options={{ title: 'Announcements' }} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}

export default function StudentNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Grades') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Assessments') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Announcements') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Grades" component={GradesStack} />
      <Tab.Screen name="Attendance" component={AttendanceStack} />
      <Tab.Screen name="Assessments" component={AssessmentsStack} />
      <Tab.Screen name="Announcements" component={AnnouncementsStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
```

---

#### Task 6: Create App Entry Point (30 mins)

**File: `src/App.jsx`**
```javascript
import React from 'react';
import { useAuthStore } from './store/authStore';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return <RootNavigator />;
}
```

**File: `App.jsx` (root)**
```javascript
import App from './src/App';
export default App;
```

---

#### Task 7: Create Placeholder Screens (2 hours)

Create all screen files as placeholder components that render a simple text saying "Screen under development - [ScreenName]"

Example for `src/screens/student/DashboardScreen.jsx`:
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Screen under development</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
```

Repeat for all screens in the folder structure.

---

#### Task 8: Test Navigation (30 mins)

```bash
# Start Expo
npm start

# Press 'i' for iOS simulator or 'a' for Android emulator
# Or scan QR code with Expo Go on phone

# Verify:
# - App loads without errors
# - Can navigate between auth screens
# - Can navigate between student tabs
```

---

### 🔄 HANDOFF TO MOBILE TEAM

**What Person 2 delivers:**
- ✅ React Native project initialized with Expo
- ✅ Folder structure organized
- ✅ Navigation system working
- ✅ Configuration files (colors, spacing, constants)
- ✅ API base setup with axios
- ✅ Auth store with Zustand
- ✅ Git repository updated
- ✅ All placeholder screens created
- ✅ App runs without errors

**Git flow:**
```bash
git add .
git commit -m "feat: Initialize React Native navigation and project structure"
git push origin mobile-app-development
```

**Verifiable checklist:**
- [ ] App runs: `npm start`
- [ ] Navigation works between all tabs
- [ ] No TypeErrors or warnings on startup
- [ ] Placeholder screens render
- [ ] Git history is clean

---

### ⏰ TIMELINE FOR PERSON 2
- **Day 1 Morning**: Initialize project + install dependencies (1 hour)
- **Day 1 Afternoon**: Folder structure + config files (1.5 hours)
- **Day 2 Morning**: API & store setup (1 hour)
- **Day 2 Afternoon**: Navigation structure (2 hours)
- **Day 3 Morning**: Placeholder screens (2 hours)
- **Day 3 Afternoon**: Testing & bug fixes (1 hour)

**Total Time:** ~8.5 hours over 1.5 days
**Remaining Time:** Available to troubleshoot navigation issues for other team members

---

### ✅ ACCEPTANCE CRITERIA

- [ ] `npm start` runs without errors
- [ ] Navigation between 6 tabs works smoothly
- [ ] Auth navigator has 3 screens
- [ ] Student navigator has 6+ screens
- [ ] Token persistence working (survives app restart)
- [ ] API interceptors working (console logs show Bearer token added)
- [ ] All files use React Native syntax (not React Web)
- [ ] Git commits are clean and descriptive
- [ ] README instructions for running project

---


