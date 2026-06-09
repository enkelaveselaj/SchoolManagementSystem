import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import studentManagementService from '../../services/studentManagementService';
import schoolService from '../../services/schoolService';

export default function AdminStudentEnrollmentScreen() {
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Student Enrollment</Text>

      <View style={styles.section}>
        <TextInput style={styles.input} placeholder="Student ID" value={enrollment.studentId} onChangeText={t => setEnrollment({...enrollment, studentId: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Class ID" value={enrollment.classId} onChangeText={t => setEnrollment({...enrollment, classId: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Section ID" value={enrollment.sectionId} onChangeText={t => setEnrollment({...enrollment, sectionId: t})} keyboardType="numeric" />

        <TouchableOpacity style={styles.button} onPress={handleEnroll}>
          <Text style={styles.buttonText}>Enroll Student</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        <Text style={styles.sectionTitle}>Students List</Text>
        {students.map(s => (
          <View key={s.id} style={styles.item}>
            <Text style={styles.itemText}>{s.firstName} {s.lastName} (ID: {s.id})</Text>
            <Text style={styles.itemSub}>Class ID: {s.classId || 'Not Assigned'} | Section ID: {s.sectionId || 'Not Assigned'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  section: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md },
  list: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16, fontWeight: 'bold' },
  itemSub: { fontSize: 12, color: colors.gray500, marginTop: 2 }
});
