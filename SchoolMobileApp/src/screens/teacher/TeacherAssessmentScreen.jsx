import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import academicService from '../../services/academicService';

export default function TeacherAssessmentScreen({ navigation }) {
  const [assessments, setAssessments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', type: 'Exam', maxMarks: '100', subjectId: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [res, subRes] = await Promise.all([
        academicService.getAssessments(),
        academicService.getSubjects()
    ]);
    if (res.success) setAssessments(res.data);
    if (subRes.success) setSubjects(subRes.data);
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
      loadData();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Scoring', { assessmentId: item.id, assessmentTitle: item.title, subjectId: item.subjectId })}
    >
      <View style={{flex: 1}}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSub}>{item.type} | Max: {item.maxMarks}</Text>
        <Text style={styles.itemSub}>Sub ID: {item.subjectId}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: spacing.lg}}>
        <Text style={styles.title}>Manage Assessments</Text>

        <View style={styles.form}>
            <Text style={styles.label}>New Assessment</Text>
            <TextInput style={styles.input} placeholder="Title" value={formData.title} onChangeText={t => setFormData({...formData, title: t})} />
            <TextInput style={styles.input} placeholder="Subject ID" value={formData.subjectId} onChangeText={t => setFormData({...formData, subjectId: t})} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Max Marks" value={formData.maxMarks} onChangeText={t => setFormData({...formData, maxMarks: t})} keyboardType="numeric" />

            <View style={styles.typeRow}>
                {['Exam', 'Quiz', 'Assignment'].map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.typeBtn, formData.type === t && styles.typeBtnActive]}
                        onPress={() => setFormData({...formData, type: t})}
                    >
                        <Text style={[styles.typeBtnText, formData.type === t && styles.typeBtnTextActive]}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCreate}>
                <Text style={styles.buttonText}>Create Now</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Reference: Subject IDs</Text>
        <View style={styles.refContainer}>
            {subjects.map(s => (
                <Text key={s.id} style={styles.refText}>ID: {s.id} - {s.name}</Text>
            ))}
        </View>

        <Text style={styles.sectionTitle}>Existing Assessments</Text>
        {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
            assessments.map(item => (
                <TouchableOpacity
                    key={item.id}
                    style={styles.item}
                    onPress={() => navigation.navigate('Scoring', { assessmentId: item.id, assessmentTitle: item.title, subjectId: item.subjectId })}
                >
                    <View style={{flex: 1}}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSub}>{item.type} | Max: {item.maxMarks} | Sub ID: {item.subjectId}</Text>
                        <Text style={styles.scoreHint}>Tap to Score Students</Text>
                    </View>
                </TouchableOpacity>
            ))
        )}
      </ScrollView>
    </View>
  );
}

import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, marginTop: spacing.md },
  form: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg, elevation: 2 },
  label: { fontWeight: 'bold', marginBottom: 10, color: colors.primary },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  typeBtn: { flex: 1, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' },
  typeBtnActive: { backgroundColor: colors.primary },
  typeBtnText: { color: colors.primary, fontWeight: 'bold', fontSize: 12 },
  typeBtnTextActive: { color: colors.white },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
  refContainer: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 20 },
  refText: { fontSize: 12, color: '#666', marginBottom: 4 },
  item: { backgroundColor: colors.white, padding: 15, marginBottom: 10, borderRadius: 12, elevation: 1 },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemSub: { fontSize: 12, color: colors.gray500, marginTop: 4 },
  scoreHint: { fontSize: 10, color: colors.primary, fontWeight: 'bold', marginTop: 8 }
});
