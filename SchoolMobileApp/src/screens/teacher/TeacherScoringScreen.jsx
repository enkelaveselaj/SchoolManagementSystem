import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import academicService from '../../services/academicService';
import studentManagementService from '../../services/studentManagementService';

export default function TeacherScoringScreen({ route }) {
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.firstName} {item.lastName} (ID: {item.id})</Text>
      <View style={styles.scoreRow}>
        <TextInput
          style={styles.scoreInput}
          placeholder="Score"
          value={scores[item.id]}
          onChangeText={t => setScores({...scores, [item.id]: t})}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.saveBtn} onPress={() => handleSaveScore(item.id)}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scoring: {assessmentTitle}</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={students}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No students found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100, padding: spacing.lg },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: spacing.lg },
  item: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.md },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  scoreRow: { flexDirection: 'row', gap: 10 },
  scoreInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 },
  saveBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  saveBtnText: { color: colors.white, fontWeight: 'bold' }
});
