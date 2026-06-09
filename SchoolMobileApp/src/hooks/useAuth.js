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
      setIsLoading?.(true);
      try {
        const result = await authService.login(email, password);
        if (result.success) {
          setUser?.(result.user);
          setToken?.(result.token);
          return { success: true };
        }
        return { success: false, error: result.error };
      } finally {
        setIsLoading?.(false);
      }
    },
    [setUser, setToken, setIsLoading]
  );

  const register = useCallback(
    async (email, firstName, lastName, password, confirmPassword) => {
      setIsLoading?.(true);
      try {
        const result = await authService.register(email, firstName, lastName, password, confirmPassword);
        if (result.success) {
          return { success: true, message: result.message };
        }
        return { success: false, error: result.error };
      } finally {
        setIsLoading?.(false);
      }
    },
    [setIsLoading]
  );

  const forgotPassword = useCallback(
    async (email) => {
      setIsLoading?.(true);
      try {
        const result = await authService.forgotPassword(email);
        if (result.success) {
          return { success: true, message: result.message };
        }
        return { success: false, error: result.error };
      } finally {
        setIsLoading?.(false);
      }
    },
    [setIsLoading]
  );

  const resetPassword = useCallback(
    async (token, newPassword, confirmPassword) => {
      setIsLoading?.(true);
      try {
        const result = await authService.resetPassword(token, newPassword, confirmPassword);
        if (result.success) {
          return { success: true, message: result.message };
        }
        return { success: false, error: result.error };
      } finally {
        setIsLoading?.(false);
      }
    },
    [setIsLoading]
  );

  const logout = useCallback(async () => {
    setIsLoading?.(true);
    try {
      await authService.logout();
      await storeLogout();
      return { success: true };
    } finally {
      setIsLoading?.(false);
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

