import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { spacing } from '../../styles';
import academicService from '../../services/academicService';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherAssessmentScreen({ navigation }) {
  const { colors } = useTheme();
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

  const dynamicStyles = styles(colors);

  return (
    <View style={dynamicStyles.container}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: spacing.lg}}>
        <Text style={dynamicStyles.title}>Manage Assessments</Text>

        <View style={dynamicStyles.form}>
            <Text style={dynamicStyles.label}>New Assessment</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Title"
              placeholderTextColor={colors.textSecondary}
              value={formData.title}
              onChangeText={t => setFormData({...formData, title: t})}
            />
            <TextInput
              style={dynamicStyles.input}
              placeholder="Subject ID"
              placeholderTextColor={colors.textSecondary}
              value={formData.subjectId}
              onChangeText={t => setFormData({...formData, subjectId: t})}
              keyboardType="numeric"
            />
            <TextInput
              style={dynamicStyles.input}
              placeholder="Max Marks"
              placeholderTextColor={colors.textSecondary}
              value={formData.maxMarks}
              onChangeText={t => setFormData({...formData, maxMarks: t})}
              keyboardType="numeric"
            />

            <View style={dynamicStyles.typeRow}>
                {['Exam', 'Quiz', 'Assignment'].map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[dynamicStyles.typeBtn, formData.type === t && dynamicStyles.typeBtnActive]}
                        onPress={() => setFormData({...formData, type: t})}
                    >
                        <Text style={[dynamicStyles.typeBtnText, formData.type === t && dynamicStyles.typeBtnTextActive]}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={dynamicStyles.button} onPress={handleCreate}>
                <Text style={dynamicStyles.buttonText}>Create Now</Text>
            </TouchableOpacity>
        </View>

        <Text style={dynamicStyles.sectionTitle}>Reference: Subject IDs</Text>
        <View style={dynamicStyles.refContainer}>
            {subjects.map(s => (
                <Text key={s.id} style={dynamicStyles.refText}>ID: {s.id} - {s.name}</Text>
            ))}
        </View>

        <Text style={dynamicStyles.sectionTitle}>Existing Assessments</Text>
        {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
            assessments.map(item => (
                <TouchableOpacity
                    key={item.id}
                    style={dynamicStyles.item}
                    onPress={() => navigation.navigate('Scoring', { assessmentId: item.id, assessmentTitle: item.title, subjectId: item.subjectId })}
                >
                    <View style={{flex: 1}}>
                        <Text style={dynamicStyles.itemTitle}>{item.title}</Text>
                        <Text style={dynamicStyles.itemSub}>{item.type} | Max: {item.maxMarks} | Sub ID: {item.subjectId}</Text>
                        <Text style={dynamicStyles.scoreHint}>Tap to Score Students</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                </TouchableOpacity>
            ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, marginTop: spacing.md, color: colors.text },
  form: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 16, marginBottom: spacing.lg, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  label: { fontWeight: '700', marginBottom: 12, color: colors.primary, textTransform: 'uppercase', fontSize: 12 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 12, color: colors.text, fontSize: 16 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' },
  typeBtnActive: { backgroundColor: colors.primary },
  typeBtnText: { color: colors.primary, fontWeight: 'bold', fontSize: 12 },
  typeBtnTextActive: { color: "#FFFFFF" },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 16 },
  refContainer: { backgroundColor: colors.card, padding: 12, borderRadius: 12, marginBottom: 20 },
  refText: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  item: {
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  itemSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  scoreHint: { fontSize: 11, color: colors.primary, fontWeight: 'bold', marginTop: 8 }
});
