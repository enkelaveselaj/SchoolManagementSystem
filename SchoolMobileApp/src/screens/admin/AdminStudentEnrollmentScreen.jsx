import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { spacing } from '../../styles';
import studentManagementService from '../../services/studentManagementService';
import schoolService from '../../services/schoolService';
import { useTheme } from '../../hooks/useTheme';

export default function AdminStudentEnrollmentScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [enrollment, setEnrollment] = useState({ studentId: '', classId: '', sectionId: '' });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const res = await studentManagementService.getAllStudents();
    if (res.success) setStudents(res.data);
    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!enrollment.studentId || !enrollment.classId || !enrollment.sectionId) {
      return Alert.alert('Error', 'Please provide Student, Class, and Section IDs');
    }

    setLoading(true);
    const res = await studentManagementService.updateStudent(enrollment.studentId, {
      classId: parseInt(enrollment.classId),
      sectionId: parseInt(enrollment.sectionId)
    });
    setLoading(false);

    if (res.success) {
      Alert.alert('Success', 'Student enrolled successfully');
      setEnrollment({ studentId: '', classId: '', sectionId: '' });
      loadStudents();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const dynamicStyles = styles(colors);

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
      <Text style={dynamicStyles.title}>Student Enrollment</Text>

      <View style={dynamicStyles.section}>
        <TextInput style={dynamicStyles.input} placeholder="Student ID" placeholderTextColor={colors.textSecondary} value={enrollment.studentId} onChangeText={t => setEnrollment({...enrollment, studentId: t})} keyboardType="numeric" />
        <TextInput style={dynamicStyles.input} placeholder="Class ID" placeholderTextColor={colors.textSecondary} value={enrollment.classId} onChangeText={t => setEnrollment({...enrollment, classId: t})} keyboardType="numeric" />
        <TextInput style={dynamicStyles.input} placeholder="Section ID" placeholderTextColor={colors.textSecondary} value={enrollment.sectionId} onChangeText={t => setEnrollment({...enrollment, sectionId: t})} keyboardType="numeric" />

        <TouchableOpacity style={dynamicStyles.button} onPress={handleEnroll}>
          <Text style={dynamicStyles.buttonText}>Enroll Student</Text>
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.list}>
        <Text style={dynamicStyles.sectionTitle}>Students List</Text>
        {students.map(s => (
          <View key={s.id} style={dynamicStyles.item}>
            <Text style={dynamicStyles.itemText}>{s.firstName} {s.lastName} (ID: {s.id})</Text>
            <Text style={dynamicStyles.itemSub}>Class ID: {s.classId || 'Not Assigned'} | Section ID: {s.sectionId || 'Not Assigned'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  section: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, marginBottom: 12, color: colors.text },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: "#fff", fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, color: colors.text },
  list: { backgroundColor: colors.card, borderRadius: 12, padding: spacing.md },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemText: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  itemSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 }
});
