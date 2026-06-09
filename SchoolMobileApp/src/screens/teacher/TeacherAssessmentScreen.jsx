import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import academicService from '../../services/academicService';

export default function TeacherAssessmentScreen() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', type: 'Exam', maxMarks: '100', subjectId: '' });

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    const res = await academicService.getAssessments();
    if (res.success) setAssessments(res.data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.subjectId) return Alert.alert('Error', 'Title and Subject ID are required');

    const res = await academicService.createAssessment({
        ...formData,
        maxMarks: parseInt(formData.maxMarks),
        subjectId: parseInt(formData.subjectId)
    });

    if (res.success) {
      Alert.alert('Success', 'Assessment created');
      setFormData({ title: '', type: 'Exam', maxMarks: '100', subjectId: '' });
      loadAssessments();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemSub}>{item.type} | Max Marks: {item.maxMarks}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Assessments</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Assessment Title" value={formData.title} onChangeText={t => setFormData({...formData, title: t})} />
        <TextInput style={styles.input} placeholder="Subject ID" value={formData.subjectId} onChangeText={t => setFormData({...formData, subjectId: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Max Marks (Default 100)" value={formData.maxMarks} onChangeText={t => setFormData({...formData, maxMarks: t})} keyboardType="numeric" />

        <View style={styles.typeRow}>
            {['Exam', 'Assignment', 'Quiz'].map(type => (
                <TouchableOpacity
                    key={type}
                    style={[styles.typeBtn, formData.type === type && styles.typeBtnActive]}
                    onPress={() => setFormData({...formData, type})}
                >
                    <Text style={[styles.typeBtnText, formData.type === type && styles.typeBtnTextActive]}>{type}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Create Assessment</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Existing Assessments</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
            data={assessments}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, marginTop: spacing.md },
  form: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  typeBtn: { flex: 1, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' },
  typeBtnActive: { backgroundColor: colors.primary },
  typeBtnText: { color: colors.primary, fontWeight: 'bold' },
  typeBtnTextActive: { color: colors.white },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
  list: { paddingBottom: 20 },
  item: { backgroundColor: colors.white, padding: 12, marginBottom: 8, borderRadius: 8 },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemSub: { fontSize: 12, color: colors.gray500, marginTop: 4 }
});
