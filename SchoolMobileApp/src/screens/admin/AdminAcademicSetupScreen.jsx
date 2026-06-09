import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import schoolService from '../../services/schoolService';
import academicService from '../../services/academicService';
import teacherService from '../../services/teacherService';

export default function AdminAcademicSetupScreen() {
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [newYear, setNewYear] = useState({ name: '', startDate: '', endDate: '' });
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [assignment, setAssignment] = useState({ teacherId: '', subjectId: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [yearsRes, subjectsRes, teachersRes] = await Promise.all([
      schoolService.getAcademicYears(),
      academicService.getSubjects(),
      teacherService.getTeachers()
    ]);
    if (yearsRes.success) setYears(yearsRes.data);
    if (subjectsRes.success) setSubjects(subjectsRes.data);
    if (teachersRes.success) setTeachers(teachersRes.data);
    setLoading(false);
  };

  const handleCreateYear = async () => {
    if (!newYear.name) return Alert.alert('Error', 'Year name is required');
    const res = await schoolService.createAcademicYear(newYear);
    if (res.success) {
      Alert.alert('Success', 'Academic Year created');
      setNewYear({ name: '', startDate: '', endDate: '' });
      loadData();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubject.name || !newSubject.code) return Alert.alert('Error', 'Name and Code are required');
    const res = await academicService.createSubject(newSubject);
    if (res.success) {
      Alert.alert('Success', 'Subject created');
      setNewSubject({ name: '', code: '' });
      loadData();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const handleAssignTeacher = async () => {
    if (!assignment.teacherId || !assignment.subjectId) return Alert.alert('Error', 'Select both teacher and subject');
    const res = await teacherService.assignTeacherToSubject(assignment.teacherId, assignment.subjectId);
    if (res.success) {
      Alert.alert('Success', 'Teacher assigned successfully');
      setAssignment({ teacherId: '', subjectId: '' });
    } else {
      Alert.alert('Error', res.error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Academic Setup</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Years</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Year Name (e.g. 2024-2025)" value={newYear.name} onChangeText={t => setNewYear({...newYear, name: t})} />
          <TouchableOpacity style={styles.button} onPress={handleCreateYear}>
            <Text style={styles.buttonText}>Add Year</Text>
          </TouchableOpacity>
        </View>
        {years.map(y => (
          <View key={y.id} style={styles.item}><Text>{y.name} (ID: {y.id})</Text></View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subjects</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Subject Name" value={newSubject.name} onChangeText={t => setNewSubject({...newSubject, name: t})} />
          <TextInput style={styles.input} placeholder="Code" value={newSubject.code} onChangeText={t => setNewSubject({...newSubject, code: t})} />
          <TouchableOpacity style={styles.button} onPress={handleCreateSubject}>
            <Text style={styles.buttonText}>Add Subject</Text>
          </TouchableOpacity>
        </View>
        {subjects.map(s => (
          <View key={s.id} style={styles.item}><Text>{s.name} ({s.code}) (ID: {s.id})</Text></View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teachers (For Reference)</Text>
        {teachers.map(t => (
          <View key={t.id} style={styles.item}>
            <Text>{t.firstName} {t.lastName} (Teacher ID: {t.id})</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assign Teacher to Subject</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Teacher ID" value={assignment.teacherId} onChangeText={t => setAssignment({...assignment, teacherId: t})} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Subject ID" value={assignment.subjectId} onChangeText={t => setAssignment({...assignment, subjectId: t})} keyboardType="numeric" />
          <TouchableOpacity style={[styles.button, {backgroundColor: colors.secondary}]} onPress={handleAssignTeacher}>
            <Text style={styles.buttonText}>Assign Teacher</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  section: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md },
  form: { marginBottom: spacing.md },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8 },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  helpText: { fontSize: 12, color: colors.gray500, marginBottom: 10 }
});
