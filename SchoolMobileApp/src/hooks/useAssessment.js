import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import assessmentService from '../services/assessmentService';

export function useAssessment() {
  const user = useAuthStore((state) => state.user);
  const [assessments, setAssessments] = useState([]);
  const [assessmentDetail, setAssessmentDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssessments = useCallback(async (filter = {}) => {
    if (!user?.id) return;
    setLoading(true);
    const result = await assessmentService.getAssessments(user.id, filter);
    if (result.success) {
      setAssessments(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [user?.id]);

  const fetchAssessmentDetails = useCallback(async (assessmentId) => {
    setLoading(true);
    const result = await assessmentService.getAssessmentDetails(assessmentId);
    if (result.success) {
      setAssessmentDetail(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const submitAssessment = useCallback(async (assessmentId, data) => {
    setLoading(true);
    const result = await assessmentService.submitAssessment(assessmentId, data);
    if (result.success) {
      setError(null);
      return { success: true, data: result.data };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  return {
    assessments,
    assessmentDetail,
    loading,
    error,
    fetchAssessments,
    fetchAssessmentDetails,
    submitAssessment,
  };
}

