import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { spacing } from '../../styles';
import academicService from '../../services/academicService';
import { useTheme } from '../../hooks/useTheme';

export default function StudentAssessmentsScreen() {
  const { colors } = useTheme();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await academicService.getAssessments();
    if (res.success) setAssessments(res.data);
    setLoading(false);
  };

  const dynamicStyles = styles(colors);

  const renderItem = ({ item }) => (
    <View style={dynamicStyles.card}>
      <Text style={dynamicStyles.titleText}>{item.title}</Text>
      <Text style={dynamicStyles.subText}>{item.type} | Max Marks: {item.maxMarks}</Text>
      <Text style={dynamicStyles.dateText}>Subject ID: {item.subjectId}</Text>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.header}>Upcoming Assessments</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={assessments}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={dynamicStyles.emptyText}>No assessments available.</Text>}
        />
      )}
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  titleText: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  subText: { color: colors.textSecondary, marginTop: 4 },
  dateText: { fontSize: 12, color: colors.primary, marginTop: 8, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 20 }
});
