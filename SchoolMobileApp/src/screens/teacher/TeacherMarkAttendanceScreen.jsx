import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { spacing, borderRadius, shadow } from '../../styles';
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
  const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' | 'late' | 'excused' }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);

  const getLocalDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
            // Default everyone to present
            studentsRes.data.forEach(s => {
                if (s.id) attendanceMap[s.id] = 'present';
            });

            // Override with existing data if found
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

  const updateStatus = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = async () => {
    if (!teacherProfile) return Alert.alert('Error', 'Teacher profile not found');

    const records = students
        .filter(s => s.id !== undefined && s.id !== null)
        .map(s => ({
            studentId: parseInt(s.id),
            status: attendance[s.id] || 'present'
        }));

    if (records.length === 0) return Alert.alert('Error', 'No students to mark');

    const payload = {
      classId: parseInt(classId),
      subjectId: parseInt(subjectId) || 1,
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
        navigation.goBack();
      } else {
        throw new Error(res.error);
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to save attendance');
    }
    setSaving(false);
  };

  const stats = useMemo(() => {
    const total = students.length;
    const present = Object.values(attendance).filter(v => v === 'present').length;
    const absent = Object.values(attendance).filter(v => v === 'absent').length;
    const others = total - present - absent;
    return { total, present, absent, others };
  }, [attendance, students]);

  const dynamicStyles = styles(colors);

  const StatusButton = ({ studentId, status, currentStatus, label, icon, activeColor }) => (
    <TouchableOpacity
      style={[
        dynamicStyles.statusBtn,
        currentStatus === status && { backgroundColor: activeColor, borderColor: activeColor }
      ]}
      onPress={() => updateStatus(studentId, status)}
    >
      <Ionicons
        name={icon}
        size={16}
        color={currentStatus === status ? '#FFF' : colors.textSecondary}
      />
      <Text style={[
        dynamicStyles.statusBtnText,
        currentStatus === status && { color: '#FFF' }
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const currentStatus = attendance[item.id];
    return (
      <View style={dynamicStyles.item}>
        <View style={dynamicStyles.studentInfo}>
            <View style={dynamicStyles.avatar}>
                <Text style={dynamicStyles.avatarText}>
                    {item.firstName?.[0]}{item.lastName?.[0]}
                </Text>
            </View>
            <View>
                <Text style={dynamicStyles.name}>{item.firstName} {item.lastName}</Text>
                <Text style={dynamicStyles.idText}>ID: {item.id}</Text>
            </View>
        </View>

        <View style={dynamicStyles.actions}>
            <StatusButton
                studentId={item.id}
                status="present"
                currentStatus={currentStatus}
                label="P"
                icon="checkmark-circle"
                activeColor="#4CAF50"
            />
            <StatusButton
                studentId={item.id}
                status="absent"
                currentStatus={currentStatus}
                label="A"
                icon="close-circle"
                activeColor="#F44336"
            />
            <StatusButton
                studentId={item.id}
                status="late"
                currentStatus={currentStatus}
                label="L"
                icon="time"
                activeColor="#FF9800"
            />
        </View>
      </View>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <View>
            <Text style={dynamicStyles.title}>Mark Attendance</Text>
            <Text style={dynamicStyles.subtitle}>{className || 'Class'} • {subjectName || 'Subject'}</Text>
        </View>
        <View style={dynamicStyles.dateContainer}>
            <Ionicons name="calendar" size={18} color={colors.primary} />
            <Text style={dynamicStyles.dateText}>{new Date(selectedDate).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={dynamicStyles.statsRow}>
        <View style={[dynamicStyles.statCard, { borderLeftColor: '#4CAF50' }]}>
            <Text style={dynamicStyles.statValue}>{stats.present}</Text>
            <Text style={dynamicStyles.statLabel}>Present</Text>
        </View>
        <View style={[dynamicStyles.statCard, { borderLeftColor: '#F44336' }]}>
            <Text style={dynamicStyles.statValue}>{stats.absent}</Text>
            <Text style={dynamicStyles.statLabel}>Absent</Text>
        </View>
        <View style={[dynamicStyles.statCard, { borderLeftColor: '#FF9800' }]}>
            <Text style={dynamicStyles.statValue}>{stats.others}</Text>
            <Text style={dynamicStyles.statLabel}>Late/Exc</Text>
        </View>
      </View>

      {loading ? (
        <View style={dynamicStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={dynamicStyles.loadingText}>Loading students...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={students}
            keyExtractor={item => item.id?.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
                <View style={dynamicStyles.center}>
                    <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
                    <Text style={dynamicStyles.empty}>No students enrolled</Text>
                </View>
            }
            contentContainerStyle={{ padding: spacing.md }}
          />

          <View style={dynamicStyles.footer}>
            <TouchableOpacity
                style={[dynamicStyles.saveButton, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving || students.length === 0}
            >
                {saving ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <>
                        <Ionicons name="cloud-upload" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={dynamicStyles.saveButtonText}>Submit Attendance</Text>
                    </>
                )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  dateText: { marginLeft: 6, fontWeight: '600', color: colors.text, fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.md,
    justifyContent: 'space-between'
  },
  statCard: {
    backgroundColor: colors.card,
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    ...shadow,
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  item: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow,
    elevation: 1,
  },
  studentInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: { color: colors.primary, fontWeight: 'bold', fontSize: 14 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  idText: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row' },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 6,
    minWidth: 45,
    justifyContent: 'center'
  },
  statusBtnText: { marginLeft: 4, fontWeight: 'bold', fontSize: 12, color: colors.textSecondary },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButtonText: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: colors.textSecondary },
  empty: { marginTop: 12, color: colors.textSecondary, fontSize: 16 }
});
