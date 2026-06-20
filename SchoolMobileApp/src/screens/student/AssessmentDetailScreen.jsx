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
import { spacing } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

export default function AssessmentDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { id } = route.params;
  const { assessmentDetail, loading, fetchAssessmentDetails } = useAssessment();

  useEffect(() => {
    fetchAssessmentDetails(id);
  }, [id]);

  const dynamicStyles = styles(colors);

  if (loading || !assessmentDetail) {
    return (
      <View style={dynamicStyles.loadingContainer}>
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
    <ScrollView style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>{title}</Text>
        <View
          style={[
            dynamicStyles.statusBadge,
            { backgroundColor: getStatusColor(status) },
          ]}
        >
          <Text style={dynamicStyles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Subject */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Subject</Text>
        <Text style={dynamicStyles.sectionContent}>{subject}</Text>
      </View>

      {/* Description */}
      {description && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Description</Text>
          <Text style={dynamicStyles.sectionContent}>{description}</Text>
        </View>
      )}

      {/* Due Date */}
      <View style={dynamicStyles.section}>
        <View style={dynamicStyles.row}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <View style={dynamicStyles.rowContent}>
            <Text style={dynamicStyles.label}>Due Date</Text>
            <Text style={dynamicStyles.value}>
              {new Date(dueDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Score (if graded) */}
      {isSubmitted && currentScore !== undefined && (
        <View style={dynamicStyles.section}>
          <View style={dynamicStyles.row}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <View style={dynamicStyles.rowContent}>
              <Text style={dynamicStyles.label}>Your Score</Text>
              <Text style={dynamicStyles.value}>
                {currentScore} / {totalScore}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Submission Date */}
      {submissionDate && (
        <View style={dynamicStyles.section}>
          <View style={dynamicStyles.row}>
            <Ionicons name="send" size={20} color={colors.primary} />
            <View style={dynamicStyles.rowContent}>
              <Text style={dynamicStyles.label}>Submitted On</Text>
              <Text style={dynamicStyles.value}>
                {new Date(submissionDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Feedback */}
      {feedback && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Feedback</Text>
          <View style={dynamicStyles.feedbackBox}>
            <Text style={dynamicStyles.feedbackText}>{feedback}</Text>
          </View>
        </View>
      )}

      {/* Submit Button (if pending) */}
      {status === 'pending' && (
        <TouchableOpacity style={dynamicStyles.submitButton}>
          <Text style={dynamicStyles.submitButtonText}>Submit Assessment</Text>
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
      return '#9CA3AF';
  }
}

const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
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
    color: colors.textSecondary,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
  },
  feedbackBox: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.xs,
  },
  feedbackText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 'bold',
  },
});
