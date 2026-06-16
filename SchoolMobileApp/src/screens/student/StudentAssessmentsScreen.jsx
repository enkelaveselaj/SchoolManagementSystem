import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import academicService from '../../services/academicService';

export default function StudentAssessmentsScreen() {
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.subText}>{item.type} | Max Marks: {item.maxMarks}</Text>
      <Text style={styles.dateText}>Subject ID: {item.subjectId}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Assessments</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={assessments}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text>No assessments available.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100, padding: spacing.lg },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  card: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.md, elevation: 2 },
  titleText: { fontSize: 18, fontWeight: 'bold' },
  subText: { color: colors.gray500, marginTop: 4 },
  dateText: { fontSize: 12, color: colors.primary, marginTop: 8, fontWeight: '600' }
});
