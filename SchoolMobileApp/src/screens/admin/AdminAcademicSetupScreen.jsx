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
  const [classes, setClasses] = useState([]);

  const [newYear, setNewYear] = useState({ name: '', startDate: '', endDate: '' });
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [assignment, setAssignment] = useState({ teacherId: '', subjectId: '', classId: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [yearsRes, subjectsRes, teachersRes, classesRes] = await Promise.all([
        schoolService.getAcademicYears(),
        academicService.getSubjects(),
        teacherService.getTeachers(),
        schoolService.getClasses()
      ]);
      if (yearsRes.success) setYears(yearsRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.data);
      if (teachersRes.success) setTeachers(teachersRes.data);
      if (classesRes.success) setClasses(classesRes.data);
    } catch (e) {
      console.error(e);
    }
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
    const { teacherId, subjectId, classId } = assignment;
    if (!teacherId || !subjectId || !classId) return Alert.alert('Error', 'Teacher, Subject, and Class IDs are required');

    const res = await teacherService.assignTeacherToSubject(teacherId, subjectId, classId);
    if (res.success) {
      Alert.alert('Success', 'Teacher assigned successfully');
      setAssignment({ teacherId: '', subjectId: '', classId: '' });
    } else {
      Alert.alert('Error', res.error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Academic Setup</Text>

      {/* Assignment Section (Top for visibility) */}
      <View style={[styles.section, { borderColor: colors.primary, borderWidth: 1 }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Assign Teacher to Subject & Class</Text>
        <TextInput style={styles.input} placeholder="Teacher ID" value={assignment.teacherId} onChangeText={t => setAssignment({...assignment, teacherId: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Subject ID" value={assignment.subjectId} onChangeText={t => setAssignment({...assignment, subjectId: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Class ID" value={assignment.classId} onChangeText={t => setAssignment({...assignment, classId: t})} keyboardType="numeric" />
        <TouchableOpacity style={styles.button} onPress={handleAssignTeacher}>
          <Text style={styles.buttonText}>Assign Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reference: Teachers</Text>
        {teachers.map(t => (
          <View key={t.id} style={styles.item}>
            <Text style={styles.itemText}><Text style={styles.bold}>ID: {t.id}</Text> - {t.firstName} {t.lastName}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reference: Subjects</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="New Subject Name" value={newSubject.name} onChangeText={t => setNewSubject({...newSubject, name: t})} />
          <TextInput style={styles.input} placeholder="New Code" value={newSubject.code} onChangeText={t => setNewSubject({...newSubject, code: t})} />
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]} onPress={handleCreateSubject}>
            <Text style={styles.buttonText}>Add Subject</Text>
          </TouchableOpacity>
        </View>
        {subjects.map(s => (
          <View key={s.id} style={styles.item}>
            <Text style={styles.itemText}><Text style={styles.bold}>ID: {s.id}</Text> - {s.name} ({s.code})</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reference: Classes</Text>
        {classes.map(c => (
          <View key={c.id} style={styles.item}>
            <Text style={styles.itemText}><Text style={styles.bold}>ID: {c.id}</Text> - {c.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Years</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Year (e.g. 2024-2025)" value={newYear.name} onChangeText={t => setNewYear({...newYear, name: t})} />
          <TouchableOpacity style={[styles.button, { backgroundColor: '#666' }]} onPress={handleCreateYear}>
            <Text style={styles.buttonText}>Add Year</Text>
          </TouchableOpacity>
        </View>
        {years.map(y => (
          <View key={y.id} style={styles.item}><Text style={styles.itemText}><Text style={styles.bold}>ID: {y.id}</Text> - {y.name}</Text></View>
        ))}
      </View>

      {loading && <ActivityIndicator size="large" color={colors.primary} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  section: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md },
  form: { marginBottom: spacing.md },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8, fontSize: 14 },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 14 },
  bold: { fontWeight: 'bold', color: colors.primary }
});
