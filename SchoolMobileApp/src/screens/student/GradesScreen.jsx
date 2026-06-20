import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useStudent } from '../../hooks/useStudent';
import GradeCard from '../../components/cards/GradeCard';
import { spacing } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

export default function GradesScreen() {
  const { colors } = useTheme();
  const { grades, loading, fetchGrades } = useStudent();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGrades();
    setRefreshing(false);
  };

  const dynamicStyles = styles(colors);

  if (loading && !grades.length) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2) : 0;

  return (
    <ScrollView
      style={dynamicStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
      }
    >
      {/* Header Stats */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.statBox}>
          <Text style={dynamicStyles.statLabel}>Total Grades</Text>
          <Text style={dynamicStyles.statValue}>{grades.length}</Text>
        </View>
        <View style={dynamicStyles.statBox}>
          <Text style={dynamicStyles.statLabel}>Average</Text>
          <Text style={dynamicStyles.statValue}>{avgGrade}</Text>
        </View>
      </View>

      {/* Grades List */}
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>All Grades</Text>
        {grades.length > 0 ? (
          grades.map((grade, index) => (
            <GradeCard
              key={index}
              subject={grade.subject}
              grade={grade.grade}
              date={grade.date}
            />
          ))
        ) : (
          <Text style={dynamicStyles.emptyText}>No grades yet</Text>
        )}
      </View>
    </ScrollView>
  );
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
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  statBox: {
    flex: 1,
    marginHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: spacing.md,
    borderRadius: 12,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
});
