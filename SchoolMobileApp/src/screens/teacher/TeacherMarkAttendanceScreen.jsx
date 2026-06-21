import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { spacing, shadow } from '../../styles';
import studentManagementService from '../../services/studentManagementService';
import academicService from '../../services/academicService';
import teacherService from '../../services/teacherService';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherMarkAttendanceScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { classId, sectionId, subjectId, className, subjectName } = route.params;
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);

  const getLocalDate = (date = new Date()) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    loadInitialData();
  }, [selectedDate]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
        const [teacherRes, studentsRes, existingAttendanceRes] = await Promise.all([
            teacherService.getTeacherByUserId(user.id),
            sectionId
                ? studentManagementService.getStudentsBySection(sectionId)
                : studentManagementService.getStudentsByClass(classId),
            academicService.getClassAttendance(classId, selectedDate, subjectId)
        ]);

        if (teacherRes.success) setTeacherProfile(teacherRes.data);

        if (studentsRes.success) {
            setStudents(studentsRes.data);
            const attendanceMap = {};
            studentsRes.data.forEach(s => {
                if (s.id) attendanceMap[s.id] = 'present';
            });

            if (existingAttendanceRes.success && existingAttendanceRes.data) {
                existingAttendanceRes.data.forEach(record => {
                    attendanceMap[record.studentId] = record.status.toLowerCase();
                });
            }
            setAttendance(attendanceMap);
        }
    } catch (err) {
        console.error('Error loading attendance data:', err);
    }
    setLoading(false);
  };

  const changeDate = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (current > today) {
        Alert.alert('Invalid Date', 'Cannot mark attendance for future dates');
        return;
    }
    setSelectedDate(getLocalDate(current));
  };

  const handleSave = async () => {
    if (!teacherProfile) return Alert.alert('Error', 'Teacher profile not found');
    if (!subjectId) return Alert.alert('Error', 'Subject ID is missing. Ensure this class is correctly assigned.');

    const records = students.map(s => ({
        studentId: parseInt(s.id),
        status: attendance[s.id] || 'present'
    }));

    const payload = {
      classId: parseInt(classId),
      subjectId: parseInt(subjectId),
      teacherId: parseInt(teacherProfile.id),
      date: selectedDate,
      attendanceRecords: records
    };

    setSaving(true);
    try {
      const res = await academicService.markAttendance(payload);
      if (res.success) {
        if (Platform.OS === 'web') alert('Attendance saved successfully');
        else Alert.alert('Success', 'Attendance saved successfully');
      } else {
        throw new Error(res.error);
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to save attendance');
    }
    setSaving(false);
  };

  const dynamicStyles = styles(colors);

  const StatusButton = ({ studentId, status, currentStatus, label, color }) => (
    <TouchableOpacity
      style={[
        dynamicStyles.statusBtn,
        currentStatus === status && { backgroundColor: color, borderColor: color }
      ]}
      onPress={() => setAttendance({...attendance, [studentId]: status})}
    >
      <Text style={[dynamicStyles.statusBtnText, currentStatus === status && { color: '#FFF' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerTop}>
            <View>
                <Text style={dynamicStyles.title}>Mark Attendance</Text>
                <Text style={dynamicStyles.subtitle}>{className} • {subjectName}</Text>
            </View>
            <View style={dynamicStyles.datePicker}>
                <TouchableOpacity onPress={() => changeDate(-1)} style={dynamicStyles.dateNav}><Ionicons name="chevron-back" size={20} color={colors.primary} /></TouchableOpacity>
                <Text style={dynamicStyles.dateText}>{selectedDate}</Text>
                <TouchableOpacity onPress={() => changeDate(1)} style={dynamicStyles.dateNav}><Ionicons name="chevron-forward" size={20} color={colors.primary} /></TouchableOpacity>
            </View>
        </View>
      </View>

      {loading ? (
        <View style={dynamicStyles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <>
          <FlatList
            data={students}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={dynamicStyles.item}>
                <Text style={dynamicStyles.name}>{item.firstName} {item.lastName}</Text>
                <View style={dynamicStyles.actions}>
                    <StatusButton studentId={item.id} status="present" currentStatus={attendance[item.id]} label="P" color="#4CAF50" />
                    <StatusButton studentId={item.id} status="absent" currentStatus={attendance[item.id]} label="A" color="#F44336" />
                    <StatusButton studentId={item.id} status="late" currentStatus={attendance[item.id]} label="L" color="#FF9800" />
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={dynamicStyles.empty}>No students found. Enroll them in Admin Panel.</Text>}
            contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}
          />
          <View style={dynamicStyles.footer}>
            <TouchableOpacity style={dynamicStyles.saveButton} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#FFF" /> : <Text style={dynamicStyles.saveButtonText}>Save Attendance</Text>}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border, ...shadow, elevation: 4 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  datePicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  dateNav: { padding: 8 },
  dateText: { fontWeight: 'bold', color: colors.primary, fontSize: 13, minWidth: 90, textAlign: 'center' },
  item: { backgroundColor: colors.card, padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 1 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
  actions: { flexDirection: 'row', gap: 6 },
  statusBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  statusBtnText: { fontWeight: 'bold', fontSize: 14, color: colors.textSecondary },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  saveButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 40, color: colors.textSecondary }
});
