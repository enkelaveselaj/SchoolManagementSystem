import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import studentManagementService from '../../services/studentManagementService';
import academicService from '../../services/academicService';

export default function TeacherMarkAttendanceScreen({ route, navigation }) {
  const { classId, sectionId } = route.params;
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'Present' | 'Absent' }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const res = await studentManagementService.getStudentsBySection(sectionId);
    if (res.success) {
      setStudents(res.data);
      const initial = {};
      res.data.forEach(s => initial[s.id] = 'Present');
      setAttendance(initial);
    }
    setLoading(false);
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const handleSave = async () => {
    const attendanceData = students.map(s => ({
      studentId: s.id,
      status: attendance[s.id],
      date: new Date().toISOString().split('T')[0],
      sectionId
    }));

    // In a real scenario, the backend attendance endpoint might take an array
    // For this demo, we'll try to send one by one or as a bulk if supported
    setLoading(true);
    try {
      const promises = attendanceData.map(data => academicService.markAttendance(data));
      await Promise.all(promises);
      Alert.alert('Success', 'Attendance saved successfully');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save attendance');
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
      <TouchableOpacity
        style={[styles.toggle, attendance[item.id] === 'Absent' && styles.absent]}
        onPress={() => toggleAttendance(item.id)}
      >
        <Text style={styles.toggleText}>{attendance[item.id]}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <>
          <FlatList
            data={students}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.empty}>No students found in this section.</Text>}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Attendance</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  item: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '600' },
  toggle: { backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, minWidth: 100, alignItems: 'center' },
  absent: { backgroundColor: colors.danger },
  toggleText: { color: colors.white, fontWeight: 'bold' },
  saveButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 20, color: colors.gray500 }
});
