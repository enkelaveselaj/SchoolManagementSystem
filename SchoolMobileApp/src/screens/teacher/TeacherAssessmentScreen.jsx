import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { spacing, shadow } from '../../styles';
import academicService from '../../services/academicService';
import teacherService from '../../services/teacherService';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherAssessmentScreen({ navigation }) {
  const { colors } = useTheme();
  const [assessments, setAssessments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [formData, setFormData] = useState({ title: '', type: 'Exam', maxScore: '100', subjectId: '' });

  const user = useAuthStore(state => state.user);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
        console.log('Loading subjects and assessments...');
        const [res, subRes, teacherRes] = await Promise.all([
            academicService.getAssessments(),
            academicService.getSubjects(),
            teacherService.getTeacherByUserId(user.id)
        ]);

        if (res.success) setAssessments(res.data);

        if (subRes.success) {
            console.log('Subjects loaded:', subRes.data);
            setSubjects(subRes.data);
        } else {
            console.error('Failed to load subjects:', subRes.error);
        }

        if (teacherRes.success) setTeacherProfile(teacherRes.data);
    } catch (e) {
        console.error('Error in loadData:', e);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.subjectId) return Alert.alert('Error', 'Title and Subject are required');
    if (!teacherProfile) return Alert.alert('Error', 'Teacher profile not found.');

    setCreating(true);
    const res = await academicService.createAssessment({
        ...formData,
        maxScore: parseFloat(formData.maxScore),
        subjectId: parseInt(formData.subjectId),
        teacherId: teacherProfile.id,
        date: new Date().toISOString().split('T')[0]
    });

    if (res.success) {
      if (Platform.OS === 'web') alert('Assessment created successfully');
      else Alert.alert('Success', 'Assessment created');
      setFormData({ title: '', type: 'Exam', maxScore: '100', subjectId: '' });
      loadData();
    } else {
      Alert.alert('Error', res.error || 'Check if the Subject ID exists');
    }
    setCreating(false);
  };

  const dynamicStyles = styles(colors);

  return (
    <View style={dynamicStyles.container}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: spacing.lg}}>
        <View style={dynamicStyles.header}>
            <Text style={dynamicStyles.title}>Assessments</Text>
            <TouchableOpacity onPress={loadData}>
                <Ionicons name="refresh" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>

        <View style={dynamicStyles.form}>
            <Text style={dynamicStyles.label}>Create New</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Assessment Title (e.g. Midterm)"
              placeholderTextColor={colors.textSecondary}
              value={formData.title}
              onChangeText={t => setFormData({...formData, title: t})}
            />

            <Text style={dynamicStyles.smallLabel}>Select Subject</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dynamicStyles.subjectPicker}>
                {subjects.length > 0 ? subjects.map(s => (
                    <TouchableOpacity
                        key={s.id}
                        style={[dynamicStyles.subjectChip, formData.subjectId == s.id && dynamicStyles.subjectChipActive]}
                        onPress={() => setFormData({...formData, subjectId: s.id.toString()})}
                    >
                        <Text style={[dynamicStyles.subjectChipText, formData.subjectId == s.id && {color: '#FFF'}]}>{s.name}</Text>
                    </TouchableOpacity>
                )) : (
                    <Text style={{color: colors.textSecondary, fontSize: 12, paddingVertical: 10}}>
                        No subjects found in system.
                    </Text>
                )}
            </ScrollView>

            <TextInput
              style={dynamicStyles.input}
              placeholder="Max Score (default 100)"
              placeholderTextColor={colors.textSecondary}
              value={formData.maxScore}
              onChangeText={t => setFormData({...formData, maxScore: t})}
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

            <TouchableOpacity style={dynamicStyles.button} onPress={handleCreate} disabled={creating}>
                {creating ? <ActivityIndicator color="#FFF" /> : <Text style={dynamicStyles.buttonText}>Add Assessment</Text>}
            </TouchableOpacity>
        </View>

        <Text style={dynamicStyles.sectionTitle}>Existing Assessments</Text>
        {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
            assessments.length === 0 ? <Text style={dynamicStyles.empty}>No assessments created yet.</Text> :
            assessments.map(item => (
                <TouchableOpacity
                    key={item.id}
                    style={dynamicStyles.item}
                    onPress={() => navigation.navigate('Scoring', {
                        assessmentId: item.id,
                        assessmentTitle: item.title,
                        subjectId: item.subjectId,
                        maxScore: item.maxScore
                    })}
                >
                    <View style={{flex: 1}}>
                        <Text style={dynamicStyles.itemTitle}>{item.title}</Text>
                        <Text style={dynamicStyles.itemSub}>
                            {item.type} • Max: {item.maxScore} • {item.subject?.name || `Sub ID: ${item.subjectId}`}
                        </Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, marginTop: spacing.md, color: colors.text },
  form: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 16, marginBottom: spacing.lg, ...shadow, elevation: 3 },
  label: { fontWeight: '700', marginBottom: 12, color: colors.primary, textTransform: 'uppercase', fontSize: 12 },
  smallLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 12, color: colors.text, fontSize: 16 },
  subjectPicker: { flexDirection: 'row', marginBottom: 16 },
  subjectChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8, backgroundColor: colors.background },
  subjectChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  subjectChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' },
  typeBtnActive: { backgroundColor: colors.primary },
  typeBtnText: { color: colors.primary, fontWeight: 'bold', fontSize: 12 },
  typeBtnTextActive: { color: "#FFFFFF" },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 16 },
  item: {
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow,
    elevation: 2,
  },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  itemSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 20 }
});
