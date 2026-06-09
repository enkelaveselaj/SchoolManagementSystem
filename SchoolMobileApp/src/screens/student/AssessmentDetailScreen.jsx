import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAssessment } from '../../hooks/useAssessment';
import { colors, spacing } from '../../styles';

export default function AssessmentDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { assessmentDetail, loading, fetchAssessmentDetails } = useAssessment();

  useEffect(() => {
    fetchAssessmentDetails(id);
  }, [id]);

  if (loading || !assessmentDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const {
    title,
    subject,
    description,
    dueDate,
    status,
    currentScore,
    totalScore,
    submissionDate,
    feedback,
  } = assessmentDetail;

  const isSubmitted = status === 'submitted' || status === 'graded';

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(status) },
          ]}
        >
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Subject */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subject</Text>
        <Text style={styles.sectionContent}>{subject}</Text>
      </View>

      {/* Description */}
      {description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionContent}>{description}</Text>
        </View>
      )}

      {/* Due Date */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <View style={styles.rowContent}>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.value}>
              {new Date(dueDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Score (if graded) */}
      {isSubmitted && currentScore !== undefined && (
        <View style={styles.section}>
          <View style={styles.row}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Your Score</Text>
              <Text style={styles.value}>
                {currentScore} / {totalScore}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Submission Date */}
      {submissionDate && (
        <View style={styles.section}>
          <View style={styles.row}>
            <Ionicons name="send" size={20} color={colors.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Submitted On</Text>
              <Text style={styles.value}>
                {new Date(submissionDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Feedback */}
      {feedback && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        </View>
      )}

      {/* Submit Button (if pending) */}
      {status === 'pending' && (
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Assessment</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'pending':
      return '#FFC107';
    case 'submitted':
      return '#2196F3';
    case 'graded':
      return '#4CAF50';
    default:
      return colors.gray500 || '#9CA3AF';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100 || '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300 || '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray900 || '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900 || '#1F2937',
    marginBottom: spacing.sm,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.gray700 || '#374151',
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.gray600 || '#6B7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900 || '#1F2937',
    marginTop: spacing.xs,
  },
  feedbackBox: {
    backgroundColor: colors.gray100 || '#F3F4F6',
    padding: spacing.md,
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: colors.gray700 || '#374151',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

