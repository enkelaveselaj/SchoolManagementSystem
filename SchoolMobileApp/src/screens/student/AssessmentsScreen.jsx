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
import { spacing } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

export default function AssessmentsScreen({ navigation }) {
  const { colors } = useTheme();
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

  const dynamicStyles = styles(colors);

  if (loading && !assessments.length) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={dynamicStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
      }
    >
      {/* Filter Tabs */}
      <View style={dynamicStyles.tabsContainer}>
        {['pending', 'submitted', 'graded'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[dynamicStyles.tab, activeTab === tab && dynamicStyles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                dynamicStyles.tabText,
                activeTab === tab && dynamicStyles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Assessments List */}
      <View style={dynamicStyles.content}>
        {filtered.length > 0 ? (
          filtered.map((assessment) => (
            <TouchableOpacity
              key={assessment.id}
              style={dynamicStyles.assessmentCard}
              onPress={() =>
                navigation.navigate('AssessmentDetail', { id: assessment.id })
              }
            >
              <View style={dynamicStyles.cardHeader}>
                <Text style={dynamicStyles.title}>{assessment.title}</Text>
                <View
                  style={[
                    dynamicStyles.statusBadge,
                    { backgroundColor: getStatusColor(assessment.status) },
                  ]}
                >
                  <Text style={dynamicStyles.statusText}>{assessment.status}</Text>
                </View>
              </View>
              <Text style={dynamicStyles.subject}>{assessment.subject}</Text>
              <View style={dynamicStyles.cardFooter}>
                <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                <Text style={dynamicStyles.dueDate}>
                  Due: {new Date(assessment.dueDate).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={dynamicStyles.emptyText}>No {activeTab} assessments</Text>
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    padding: spacing.lg,
  },
  assessmentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  subject: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
});
