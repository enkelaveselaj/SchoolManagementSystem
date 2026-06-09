import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAssessment } from '../../hooks/useAssessment';
import { colors, spacing } from '../../styles';

export default function AssessmentsScreen({ navigation }) {
  const { assessments, loading, fetchAssessments } = useAssessment();
  const [activeTab, setActiveTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAssessments();
    setRefreshing(false);
  };

  const filterAssessments = () => {
    switch (activeTab) {
      case 'pending':
        return assessments.filter((a) => a.status === 'pending');
      case 'submitted':
        return assessments.filter((a) => a.status === 'submitted');
      case 'graded':
        return assessments.filter((a) => a.status === 'graded');
      default:
        return assessments;
    }
  };

  const filtered = filterAssessments();

  if (loading && !assessments.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {['pending', 'submitted', 'graded'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Assessments List */}
      <View style={styles.content}>
        {filtered.length > 0 ? (
          filtered.map((assessment) => (
            <TouchableOpacity
              key={assessment.id}
              style={styles.assessmentCard}
              onPress={() =>
                navigation.navigate('AssessmentDetail', { id: assessment.id })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{assessment.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(assessment.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{assessment.status}</Text>
                </View>
              </View>
              <Text style={styles.subject}>{assessment.subject}</Text>
              <View style={styles.cardFooter}>
                <Ionicons name="calendar" size={14} color={colors.gray600 || '#6B7280'} />
                <Text style={styles.dueDate}>
                  Due: {new Date(assessment.dueDate).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No {activeTab} assessments</Text>
        )}
      </View>
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300 || '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.gray600 || '#6B7280',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  assessmentCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900 || '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  subject: {
    fontSize: 12,
    color: colors.gray600 || '#6B7280',
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: colors.gray600 || '#6B7280',
    marginLeft: spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray600 || '#6B7280',
    marginTop: spacing.lg,
  },
});

