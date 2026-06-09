import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useStudent } from '../../hooks/useStudent';
import GradeCard from '../../components/cards/GradeCard';
import { colors, spacing } from '../../styles';

export default function GradesScreen() {
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

  if (loading && !grades.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2) : 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Grades</Text>
          <Text style={styles.statValue}>{grades.length}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>{avgGrade}</Text>
        </View>
      </View>

      {/* Grades List */}
      <View style={styles.content}>
        <Text style={styles.title}>All Grades</Text>
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
          <Text style={styles.emptyText}>No grades yet</Text>
        )}
      </View>
    </ScrollView>
  );
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
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.primary,
  },
  statBox: {
    flex: 1,
    marginHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: spacing.md,
    borderRadius: 8,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  statValue: {
    color: colors.white,
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
    color: colors.gray900 || '#1F2937',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray600 || '#6B7280',
    marginTop: spacing.lg,
  },
});

