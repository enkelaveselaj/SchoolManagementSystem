import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { spacing } from '../../styles';
import academicService from '../../services/academicService';
import studentManagementService from '../../services/studentManagementService';
import { useTheme } from '../../hooks/useTheme';

export default function TeacherScoringScreen({ route }) {
  const { colors } = useTheme();
  const { assessmentId, assessmentTitle, subjectId } = route.params;
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({}); // { studentId: score }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Ideally we would get students enrolled in this subject's class/section
    // For now we get all students as a demo fallback
    const [stdRes, scoresRes] = await Promise.all([
      studentManagementService.getAllStudents(),
      academicService.getAssessmentScores(assessmentId)
    ]);

    if (stdRes.success) setStudents(stdRes.data);

    if (scoresRes.success) {
      const existingScores = {};
      scoresRes.data.forEach(s => {
        existingScores[s.studentId] = s.score.toString();
      });
      setScores(existingScores);
    }
    setLoading(false);
  };

  const handleSaveScore = async (studentId) => {
    const score = scores[studentId];
    if (!score) return Alert.alert('Error', 'Please enter a score');

    const res = await academicService.submitScore({
      assessmentId,
      studentId,
      score: parseInt(score),
      submittedAt: new Date().toISOString()
    });

    if (res.success) {
      Alert.alert('Success', 'Score saved');
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const dynamicStyles = styles(colors);

  const renderItem = ({ item }) => (
    <View style={dynamicStyles.item}>
      <Text style={dynamicStyles.name}>{item.firstName} {item.lastName} (ID: {item.id})</Text>
      <View style={dynamicStyles.scoreRow}>
        <TextInput
          style={dynamicStyles.scoreInput}
          placeholder="Score"
          placeholderTextColor={colors.textSecondary}
          value={scores[item.id]}
          onChangeText={t => setScores({...scores, [item.id]: t})}
          keyboardType="numeric"
        />
        <TouchableOpacity style={dynamicStyles.saveBtn} onPress={() => handleSaveScore(item.id)}>
          <Text style={dynamicStyles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Scoring: {assessmentTitle}</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={students}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={dynamicStyles.empty}>No students found</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  item: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: colors.text },
  scoreRow: { flexDirection: 'row', gap: 10 },
  scoreInput: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, color: colors.text },
  saveBtn: { backgroundColor: colors.primary, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 8 },
  saveBtnText: { color: "#FFFFFF", fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20, color: colors.textSecondary }
});
