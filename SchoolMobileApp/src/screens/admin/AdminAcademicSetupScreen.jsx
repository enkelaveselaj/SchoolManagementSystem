import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { spacing } from '../../styles';
import schoolService from '../../services/schoolService';
import academicService from '../../services/academicService';
import teacherService from '../../services/teacherService';
import { useTheme } from '../../hooks/useTheme';

export default function AdminAcademicSetupScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [newYear, setNewYear] = useState({ name: '', startYear: '', endYear: '' });
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
    if (!newYear.name || !newYear.startYear || !newYear.endYear) {
        return Alert.alert('Error', 'Name, Start Year, and End Year are required');
    }

    // Ensure numeric values
    const payload = {
        name: newYear.name,
        startYear: parseInt(newYear.startYear),
        endYear: parseInt(newYear.endYear)
    };

    if (isNaN(payload.startYear) || isNaN(payload.endYear)) {
        return Alert.alert('Error', 'Start Year and End Year must be numbers');
    }

    const res = await schoolService.createAcademicYear(payload);
    if (res.success) {
      Alert.alert('Success', 'Academic Year created');
      setNewYear({ name: '', startYear: '', endYear: '' });
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

  const dynamicStyles = styles(colors);

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
      <Text style={dynamicStyles.title}>Academic Setup</Text>

      {/* Assignment Section */}
      <View style={[dynamicStyles.section, { borderColor: colors.primary, borderWidth: 1 }]}>
        <Text style={[dynamicStyles.sectionTitle, { color: colors.primary }]}>Assign Teacher to Subject & Class</Text>
        <TextInput style={dynamicStyles.input} placeholder="Teacher ID" placeholderTextColor={colors.textSecondary} value={assignment.teacherId} onChangeText={t => setAssignment({...assignment, teacherId: t})} keyboardType="numeric" />
        <TextInput style={dynamicStyles.input} placeholder="Subject ID" placeholderTextColor={colors.textSecondary} value={assignment.subjectId} onChangeText={t => setAssignment({...assignment, subjectId: t})} keyboardType="numeric" />
        <TextInput style={dynamicStyles.input} placeholder="Class ID" placeholderTextColor={colors.textSecondary} value={assignment.classId} onChangeText={t => setAssignment({...assignment, classId: t})} keyboardType="numeric" />
        <TouchableOpacity style={dynamicStyles.button} onPress={handleAssignTeacher}>
          <Text style={dynamicStyles.buttonText}>Assign Now</Text>
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Reference: Teachers</Text>
        {teachers.map(t => (
          <View key={t.id} style={dynamicStyles.item}>
            <Text style={dynamicStyles.itemText}><Text style={dynamicStyles.bold}>ID: {t.id}</Text> - {t.firstName} {t.lastName}</Text>
          </View>
        ))}
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Reference: Subjects</Text>
        <View style={dynamicStyles.form}>
          <TextInput style={dynamicStyles.input} placeholder="New Subject Name" placeholderTextColor={colors.textSecondary} value={newSubject.name} onChangeText={t => setNewSubject({...newSubject, name: t})} />
          <TextInput style={dynamicStyles.input} placeholder="New Code" placeholderTextColor={colors.textSecondary} value={newSubject.code} onChangeText={t => setNewSubject({...newSubject, code: t})} />
          <TouchableOpacity style={[dynamicStyles.button, { backgroundColor: colors.secondary }]} onPress={handleCreateSubject}>
            <Text style={dynamicStyles.buttonText}>Add Subject</Text>
          </TouchableOpacity>
        </View>
        {subjects.map(s => (
          <View key={s.id} style={dynamicStyles.item}>
            <Text style={dynamicStyles.itemText}><Text style={dynamicStyles.bold}>ID: {s.id}</Text> - {s.name} ({s.code})</Text>
          </View>
        ))}
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Reference: Classes</Text>
        {classes.map(c => (
          <View key={c.id} style={dynamicStyles.item}>
            <Text style={dynamicStyles.itemText}><Text style={dynamicStyles.bold}>ID: {c.id}</Text> - {c.name}</Text>
          </View>
        ))}
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Academic Years</Text>
        <View style={dynamicStyles.form}>
          <TextInput style={dynamicStyles.input} placeholder="Year Name (e.g. 2024-2025)" placeholderTextColor={colors.textSecondary} value={newYear.name} onChangeText={t => setNewYear({...newYear, name: t})} />
          <TextInput style={dynamicStyles.input} placeholder="Start Year (e.g. 2024)" placeholderTextColor={colors.textSecondary} value={newYear.startYear} onChangeText={t => setNewYear({...newYear, startYear: t})} keyboardType="numeric" />
          <TextInput style={dynamicStyles.input} placeholder="End Year (e.g. 2025)" placeholderTextColor={colors.textSecondary} value={newYear.endYear} onChangeText={t => setNewYear({...newYear, endYear: t})} keyboardType="numeric" />
          <TouchableOpacity style={[dynamicStyles.button, { backgroundColor: colors.textSecondary }]} onPress={handleCreateYear}>
            <Text style={dynamicStyles.buttonText}>Add Year</Text>
          </TouchableOpacity>
        </View>
        {years.map(y => (
          <View key={y.id} style={dynamicStyles.item}><Text style={dynamicStyles.itemText}><Text style={dynamicStyles.bold}>ID: {y.id}</Text> - {y.name} ({y.startYear}-{y.endYear})</Text></View>
        ))}
      </View>

      {loading && <ActivityIndicator size="large" color={colors.primary} />}
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  section: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, color: colors.text },
  form: { marginBottom: spacing.md },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, marginBottom: 8, fontSize: 14, color: colors.text },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: "#fff", fontWeight: 'bold' },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemText: { fontSize: 14, color: colors.text },
  bold: { fontWeight: 'bold', color: colors.primary }
});
