import { useState, useEffect, useCallback } from 'react';
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

  const fetchDashboard = useCallback(async () => {
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
  }, [user?.id]);

  const fetchGrades = useCallback(async (filter = {}) => {
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
  }, [user?.id]);

  const fetchAttendance = useCallback(async () => {
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
  }, [user?.id]);

  const fetchAttendanceStats = useCallback(async () => {
    if (!user?.id) return;
    const result = await studentService.getAttendanceStats(user.id);
    if (result.success) {
      return result.data;
    }
    return null;
  }, [user?.id]);

  const fetchTimetable = useCallback(async () => {
    if (!user?.id) return;
    const result = await studentService.getTimetable(user.id);
    if (result.success) {
      setTimetable(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
    fetchTimetable,
  };
}

