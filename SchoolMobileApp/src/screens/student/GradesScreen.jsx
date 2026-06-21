import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useStudent } from '../../hooks/useStudent';
import GradeCard from '../../components/cards/GradeCard';
import { spacing } from '../../styles';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

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

  const avgGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(1)
    : "0.0";

  return (
    <ScrollView
      style={dynamicStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
      }
    >
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.statBox}>
          <Text style={dynamicStyles.statLabel}>Total Subjects</Text>
          <Text style={dynamicStyles.statValue}>{grades.length}</Text>
        </View>
        <View style={dynamicStyles.statBox}>
          <Text style={dynamicStyles.statLabel}>GPA Average</Text>
          <Text style={dynamicStyles.statValue}>{avgGrade}</Text>
        </View>
      </View>

      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Term Grades</Text>
        {grades.length > 0 ? (
          grades.map((grade) => (
            <GradeCard
              key={grade.id}
              subject={grade.subject?.name || `Subject ${grade.subjectId}`}
              grade={grade.value}
              date={grade.finalizedAt || grade.createdAt}
            />
          ))
        ) : (
          <View style={dynamicStyles.emptyContainer}>
            <Ionicons name="school-outline" size={64} color={colors.textSecondary} />
            <Text style={dynamicStyles.emptyText}>No grades published yet</Text>
            <Text style={dynamicStyles.emptySub}>Grades appear here once your teachers finalize the term scores.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
  statValue: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  content: { padding: spacing.lg },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: spacing.md, color: colors.text },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: colors.textSecondary, marginTop: 20 },
  emptySub: { textAlign: 'center', color: colors.textSecondary, marginTop: 10, lineHeight: 20 },
});
