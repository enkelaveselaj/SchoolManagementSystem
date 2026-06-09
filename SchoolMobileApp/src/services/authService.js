import { authApi as api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      // store student id if present
      if (user?.id) await AsyncStorage.setItem('@student_id', user.id.toString());

      return { success: true, user, token };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  }

  async register(email, firstName, lastName, password, confirmPassword) {
    try {
      if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      const response = await api.post('/auth/register', {
        email,
        first_name: firstName,
        last_name: lastName,
        password
      });
      return { success: true, message: response.data?.message || 'Registration successful. Please verify your email.' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  }

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, message: response.data?.message || 'Reset email sent. Check your inbox.' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset email';
      return { success: false, error: errorMessage };
    }
  }

  async resetPassword(token, newPassword, confirmPassword) {
    try {
      if (newPassword !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
      return { success: true, message: response.data?.message || 'Password reset successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Password reset failed';
      return { success: false, error: errorMessage };
    }
  }

  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return { success: true, message: response.data?.message || 'Email verified successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Email verification failed';
      return { success: false, error: errorMessage };
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem('@student_id');
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

