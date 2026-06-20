import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { spacing } from '../../styles';
import studentManagementService from '../../services/studentManagementService';
import academicService from '../../services/academicService';
import { useTheme } from '../../hooks/useTheme';

export default function TeacherMarkAttendanceScreen({ route, navigation }) {
  const { colors } = useTheme();
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

  const dynamicStyles = styles(colors);

  const renderItem = ({ item }) => (
    <View style={dynamicStyles.item}>
      <Text style={dynamicStyles.name}>{item.firstName} {item.lastName}</Text>
      <TouchableOpacity
        style={[dynamicStyles.toggle, attendance[item.id] === 'Absent' && dynamicStyles.absent]}
        onPress={() => toggleAttendance(item.id)}
      >
        <Text style={dynamicStyles.toggleText}>{attendance[item.id]}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Mark Attendance</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <>
          <FlatList
            data={students}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={dynamicStyles.empty}>No students found in this section.</Text>}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <TouchableOpacity style={dynamicStyles.saveButton} onPress={handleSave}>
            <Text style={dynamicStyles.saveButtonText}>Save Attendance</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  item: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  toggle: { backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, minWidth: 110, alignItems: 'center' },
  absent: { backgroundColor: colors.danger },
  toggleText: { color: "#FFFFFF", fontWeight: 'bold' },
  saveButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 20, color: colors.textSecondary }
});
