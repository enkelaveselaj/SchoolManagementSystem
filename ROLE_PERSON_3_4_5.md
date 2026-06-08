# Mobile App Development - Individual Role Guide (Persons 3, 4, 5)

## 👤 PERSON 3: Authentication & User Management
### Role: Auth/Security Developer

---

### 📋 EXACT TASKS (In Order)

#### Task 1: Create AuthService (2 hours)

**File: `src/services/authService.js`**

This is the CORE service that handles all authentication calls:

```javascript
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token and user data
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENT_ID, user.id.toString());

      return { success: true, user, token };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  }

  async register(email, username, password, confirmPassword) {
    try {
      if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      const response = await api.post('/auth/register', {
        email,
        username,
        password,
      });

      return { success: true, message: 'Registration successful. Please check your email to verify.' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  }

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      });

      return { success: true, message: 'Reset email sent. Check your inbox.' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      return { success: false, error: errorMessage };
    }
  }

  async resetPassword(token, newPassword, confirmPassword) {
    try {
      if (newPassword !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      const response = await api.post(`/auth/reset-password/${token}`, {
        newPassword,
      });

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      return { success: false, error: errorMessage };
    }
  }

  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', {
        token,
      });

      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      return { success: false, error: errorMessage };
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  }

  async getCurrentUser() {
    try {
      const userString = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }
}

export default new AuthService();
```

---

#### Task 2: Create useAuth Hook (1 hour)

**File: `src/hooks/useAuth.js`**

This hook makes it easy for screens to use auth:

```javascript
import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';

export function useAuth() {
  const {
    user,
    token,
    isLoading,
    isLoggedIn,
    setUser,
    setToken,
    setIsLoading,
    logout: storeLogout,
  } = useAuthStore();

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      try {
        const result = await authService.login(email, password);
        if (result.success) {
          setUser(result.user);
          setToken(result.token);
          return { success: true };
        }
        return { success: false, error: result.error };
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setToken, setIsLoading]
  );

  const register = useCallback(
    async (email, username, password, confirmPassword) => {
      setIsLoading(true);
      try {
        const result = await authService.register(email, username, password, confirmPassword);
        if (result.success) {
          return { success: true, message: result.message };
        }
        return { success: false, error: result.error };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading]
  );

  const forgotPassword = useCallback(
    async (email) => {
      setIsLoading(true);
      try {
        const result = await authService.forgotPassword(email);
        if (result.success) {
          return { success: true, message: result.message };
        }
        return { success: false, error: result.error };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading]
  );

  const resetPassword = useCallback(
    async (token, newPassword, confirmPassword) => {
      setIsLoading(true);
      try {
        const result = await authService.resetPassword(token, newPassword, confirmPassword);
        if (result.success) {
          return { success: true, message: result.message };
        }
        return { success: false, error: result.error };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await storeLogout();
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }, [storeLogout, setIsLoading]);

  return {
    user,
    token,
    isLoading,
    isLoggedIn,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };
}
```

---

#### Task 3: Create Validator Utilities (1 hour)

**File: `src/utils/validators.js`**

```javascript
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  // At least 6 characters, 1 uppercase, 1 number
  const re = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  return re.test(password);
}

export function validateUsername(username) {
  // At least 3 characters, alphanumeric and underscore only
  return /^[a-z0-9_]{3,}$/i.test(username);
}

export function getPasswordStrength(password) {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  return strength;
}

export getPasswordStrengthLabel(strength) {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return labels[strength] || 'Very Weak';
}
```

---

#### Task 4: Create LoginScreen (2 hours)

**File: `src/screens/auth/LoginScreen.jsx`**

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';
import { colors, spacing } from '../../styles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isLoading } = useAuth();

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  const validateForm = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await login(email, password);
    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
    // If success, navigation automatically switches to StudentNavigator
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>School Management</Text>
          <Text style={styles.subtitle}>Student Portal</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="your.email@school.com"
              placeholderTextColor={colors.gray400}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.passwordContainer, passwordError && styles.inputError]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor={colors.gray400}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            disabled={isLoading}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray600,
  },
  form: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.gray100,
  },
  inputError: {
    borderColor: colors.danger,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    backgroundColor: colors.gray100,
    paddingRight: spacing.md,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
  },
  showPasswordText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  forgotPassword: {
    color: colors.primary,
    fontSize: 14,
    textAlign: 'right',
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  footerText: {
    color: colors.gray600,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
```

---

#### Task 5: Create RegisterScreen (1.5 hours)

**File: `src/screens/auth/RegisterScreen.jsx`**

Create similar to LoginScreen but with:
- Email input
- Username input
- Password input
- Confirm Password input
- Password strength indicator
- Submit button
- Link back to login

---

#### Task 6: Create ForgotPasswordScreen (1 hour)

**File: `src/screens/auth/ForgotPasswordScreen.jsx`**

Simple form with:
- Email input
- Send Reset Link button
- Success message after sending
- Link back to login

---

#### Task 7: Unit Tests for Auth (1.5 hours)

**File: `src/services/__tests__/authService.test.js`**

```javascript
import authService from '../authService';

describe('AuthService', () => {
  test('login with valid credentials returns token', async () => {
    // Mock axios to return success
    const result = await authService.login('test@test.com', 'Password123');
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });

  test('login with invalid credentials returns error', async () => {
    const result = await authService.login('test@test.com', 'wrong');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  // Add more tests for register, forgotPassword, resetPassword
});
```

**File: `src/utils/__tests__/validators.test.js`**

```javascript
import { validateEmail, validatePassword, validateUsername } from '../validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    test('accepts valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    test('rejects invalid email', () => {
      expect(validateEmail('invalid.email')).toBe(false);
    });
  });

  // More validator tests...
});
```

---

#### Task 8: UI Tests for Auth Screens (1 hour)

**File: `src/screens/__tests__/LoginScreen.test.js`**

```javascript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../auth/LoginScreen';

describe('LoginScreen', () => {
  test('renders login form', () => {
    const { getByPlaceholderText } = render(<LoginScreen navigation={{}} />);
    expect(getByPlaceholderText('your.email@school.com')).toBeTruthy();
  });

  test('calls login when button pressed', () => {
    // Add interactivity test
  });
});
```

---

### 🔄 HANDOFF TO TEAM

**What Person 3 delivers:**
- ✅ AuthService with all auth methods
- ✅ useAuth hook for easy component integration
- ✅ Validator utilities
- ✅ LoginScreen fully functional
- ✅ RegisterScreen fully functional
- ✅ ForgotPasswordScreen fully functional
- ✅ Unit & UI tests (80%+ coverage)
- ✅ Error handling & validation

**Git flow:**
```bash
git add src/services/authService.js src/hooks/useAuth.js
git add src/screens/auth/
git add src/utils/validators.js
git add src/**/__tests__/
git commit -m "feat: implement authentication flow with login, register, password reset"
git push origin mobile-app-development
```

---

### ⏰ TIMELINE FOR PERSON 3
- **Day 2-3 Morning**: AuthService (2 hours)
- **Day 3**: useAuth hook + validators (2 hours)
- **Day 3-4**: LoginScreen + RegisterScreen (3.5 hours)
- **Day 4**: ForgotPasswordScreen (1 hour)
- **Day 4-5**: Tests (2.5 hours)

**Total Time:** ~11 hours over 2-3 days

---

### ✅ ACCEPTANCE CRITERIA

- [ ] All auth screens render without errors
- [ ] Form validation works (shows error messages)
- [ ] Login calls backend API correctly
- [ ] Token stored in AsyncStorage after login
- [ ] Password strength indicator shows
- [ ] Email validation works
- [ ] Forgot password flow completes
- [ ] Tests pass (80%+ coverage)
- [ ] Screens accessible from navigation

---

---

## 👤 PERSON 4: Student Dashboard & Academic Features
### Role: Features 1 - Dashboard/Grades/Attendance Developer

---

### 📋 EXACT TASKS (In Order)

#### Task 1: Create StudentService (1.5 hours)

**File: `src/services/studentService.js`**

```javascript
import api from './api';

class StudentService {
  async getDashboard(studentId) {
    try {
      const response = await api.get(`/api/dashboard/student/${studentId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getGrades(studentId, filter = {}) {
    try {
      const response = await api.get(`/grades`, {
        params: { studentId, ...filter },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAttendance(studentId, dateRange = {}) {
    try {
      const response = await api.get(
        `/attendance/student/${studentId}`,
        { params: dateRange }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAttendanceStats(studentId) {
    try {
      const response = await api.get(
        `/attendance/student/${studentId}/stats`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getTimetable(studentId) {
    try {
      const response = await api.get(`/timetable`, {
        params: { studentId },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new StudentService();
```

---

#### Task 2: Create useStudent Hook (1 hour)

**File: `src/hooks/useStudent.js`**

```javascript
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import studentService from '../services/studentService';

export function useStudent() {
  const user = useAuthStore((state) => state.user);
  const [dashboardData, setDashboardData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    if (!user?.id) return;
    setLoading(true);
    const result = await studentService.getDashboard(user.id);
    if (result.success) {
      setDashboardData(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const fetchGrades = async (filter = {}) => {
    if (!user?.id) return;
    setLoading(true);
    const result = await studentService.getGrades(user.id, filter);
    if (result.success) {
      setGrades(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const fetchAttendance = async () => {
    if (!user?.id) return;
    setLoading(true);
    const result = await studentService.getAttendance(user.id);
    if (result.success) {
      setAttendance(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const fetchAttendanceStats = async () => {
    if (!user?.id) return;
    const result = await studentService.getAttendanceStats(user.id);
    if (result.success) {
      return result.data;
    }
    return null;
  };

  useEffect(() => {
    fetchDashboard();
  }, [user?.id]);

  return {
    dashboardData,
    grades,
    attendance,
    timetable,
    loading,
    error,
    fetchDashboard,
    fetchGrades,
    fetchAttendance,
    fetchAttendanceStats,
  };
}
```

---

#### Task 3: Create DashboardScreen (2 hours)

**File: `src/screens/student/DashboardScreen.jsx`**

```javascript
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudent } from '../../hooks/useStudent';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing } from '../../styles';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { dashboardData, loading, fetchDashboard } = useStudent();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  if (!dashboardData && loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const { attendancePercentage = 0, averageGrade = 0, pendingAssessments = 0 } =
    dashboardData || {};

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.firstName}!</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Attendance')}
        >
          <Ionicons name="checkmark-circle" size={32} color={colors.success} />
          <Text style={styles.statValue}>{attendancePercentage}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Grades')}
        >
          <Ionicons name="document-text" size={32} color={colors.primary} />
          <Text style={styles.statValue}>{averageGrade.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Grade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Assessments')}
        >
          <Ionicons name="list" size={32} color={colors.warning} />
          <Text style={styles.statValue}>{pendingAssessments}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Grades Section */}
      {dashboardData?.recentGrades && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Grades</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Grades')}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {dashboardData.recentGrades.map((grade, index) => (
            <View key={index} style={styles.gradeItem}>
              <View style={styles.gradeInfo}>
                <Text style={styles.subject}>{grade.subject}</Text>
                <Text style={styles.gradeDate}>
                  {new Date(grade.date).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={[
                  styles.gradeScore,
                  { backgroundColor: getGradeColor(grade.grade) },
                ]}
              >
                <Text style={styles.gradeScoreText}>{grade.grade}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Upcoming Classes Section */}
      {dashboardData?.upcomingTimetable && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          {dashboardData.upcomingTimetable.map((session, index) => (
            <View key={index} style={styles.classItem}>
              <Ionicons
                name="time"
                size={20}
                color={colors.primary}
                style={styles.classIcon}
              />
              <View style={styles.classInfo}>
                <Text style={styles.className}>{session.subject}</Text>
                <Text style={styles.classTime}>
                  {session.time} • Room {session.room}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Latest Announcements Section */}
      {dashboardData?.latestAnnouncements && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Announcements</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Announcements')}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {dashboardData.latestAnnouncements.map((announcement, index) => (
            <View key={index} style={styles.announcementItem}>
              <Ionicons
                name="megaphone"
                size={20}
                color={colors.info}
                style={styles.announcementIcon}
              />
              <View style={styles.announcementInfo}>
                <Text style={styles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Text style={styles.announcementDate}>
                  {new Date(announcement.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function getGradeColor(grade) {
  if (grade >= 9) return colors.gradeA;
  if (grade >= 8) return colors.gradeB;
  if (grade >= 7) return colors.gradeC;
  if (grade >= 6) return colors.gradeD;
  return colors.gradeF;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  date: {
    color: colors.primaryLight,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    ...styles.shadow,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray900,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray900,
  },
  seeAll: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
  },
  gradeInfo: {
    flex: 1,
  },
  subject: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
  },
  gradeDate: {
    fontSize: 12,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  gradeScore: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeScoreText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
  },
  classIcon: {
    marginRight: spacing.md,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
  },
  classTime: {
    fontSize: 12,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  announcementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  announcementIcon: {
    marginRight: spacing.md,
  },
  announcementInfo: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
  },
  announcementDate: {
    fontSize: 12,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
```

---

#### Task 4: Create GradesScreen (1.5 hours)

**File: `src/screens/student/GradesScreen.jsx`**

Display all grades with:
- Subject filter
- Sort options
- Color-coded grades
- GradeCard component for each grade
- Pull-to-refresh

---

#### Task 5: Create AttendanceScreen (1.5 hours)

**File: `src/screens/student/AttendanceScreen.jsx`**

Display attendance with:
- Large percentage circle
- Attendance history list
- Color-coded status (Present/Absent/Late)
- Monthly breakdown
- Attendance stats

---

#### Task 6: Create Common Components (1 hour)

**File: `src/components/cards/GradeCard.jsx`**

Small reusable component for displaying a grade.

**File: `src/components/cards/AttendanceCard.jsx`**

Component for attendance statistics.

---

#### Task 7: Unit Tests (1 hour)

Test StudentService, useStudent hook, and screen rendering.

---

### 🔄 HANDOFF

**What Person 4 delivers:**
- ✅ StudentService with all data fetching
- ✅ useStudent hook
- ✅ DashboardScreen fully functional
- ✅ GradesScreen fully functional
- ✅ AttendanceScreen fully functional
- ✅ Reusable card components
- ✅ Tests (80%+ coverage)

---

### ⏰ TIMELINE FOR PERSON 4
- **Days 5-10**: Total ~8-10 hours
- Start after Person 3 completes auth

---

---

## 👤 PERSON 5: Assessments, Announcements & Notifications
### Role: Features 2 - Assessments/Announcements/Notifications Developer

---

### 📋 EXACT TASKS (In Order)

#### Task 1: Create AssessmentService (1.5 hours)

Similar to StudentService but for assessments:
- `getAssessments(studentId)`
- `getAssessmentDetails(assessmentId)`
- `submitAssessment(assessmentId, data)`

---

#### Task 2: Create NotificationService & Socket Integration (2 hours)

**File: `src/services/notificationService.js`**

Handle real-time notifications:
- Connect to Socket.io
- Listen for announcements
- Listen for grade notifications
- Listen for attendance notifications
- Listen for assessment notifications

**File: `src/services/socketService.js`**

Manage Socket.io connection lifecycle.

---

#### Task 3: Create AssessmentsScreen (1.5 hours)

Display all assessments with:
- Filter tabs (Pending, Submitted, Graded)
- Assessment card with title, due date, status
- Navigation to details

---

#### Task 4: Create AssessmentDetailScreen (1.5 hours)

Show single assessment:
- Full description
- Due date
- Current score
- Submission date
- Teacher feedback

---

#### Task 5: Create AnnouncementsScreen (1.5 hours)

Display announcements:
- List in newest first order
- Pull-to-refresh
- Search functionality
- Filter by type

---

#### Task 6: Create NotificationBanner Component (1 hour)

Small banner that displays real-time notifications as they arrive.

---

#### Task 7: Create SettingsScreen (1 hour)

User settings:
- Profile view
- Notification preferences toggle
- Theme toggle (light/dark)
- About section
- Logout button

---

#### Task 8: Setup Push Notifications (1.5 hours)

Configure:
- Request user permissions
- Register device token
- Display local notifications
- Handle notification taps

---

#### Task 9: Integration Tests (1.5 hours)

Test real-time notification flow.

---

### 🔄 HANDOFF

**What Person 5 delivers:**
- ✅ AssessmentService
- ✅ NotificationService with Socket.io
- ✅ AssessmentsScreen fully functional
- ✅ AssessmentDetailScreen
- ✅ AnnouncementsScreen fully functional
- ✅ SettingsScreen
- ✅ Push notifications working
- ✅ Real-time notification banner
- ✅ Tests (80%+ coverage)

---

### ⏰ TIMELINE FOR PERSON 5
- **Days 7-15**: Total ~13-15 hours
- Work in parallel with Person 4
- Some dependency on Backend Person 1 for notification endpoints

---

### ✅ ALL TEAM ACCEPTANCE CRITERIA

**Week 1:**
- [ ] All backend extensions implemented
- [ ] React Native project initialized
- [ ] Navigation working
- [ ] Auth flow complete

**Week 2:**
- [ ] Dashboard, Grades, Attendance screens working
- [ ] Assessments screen working
- [ ] All services fetching real data

**Week 3:**
- [ ] Announcements working
- [ ] Real-time notifications working
- [ ] Push notifications working
- [ ] Settings screen complete
- [ ] 80%+ test coverage
- [ ] Ready for app store submission


