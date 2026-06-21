import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { spacing } from '../../styles';
import teacherService from '../../services/teacherService';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherClassesScreen({ navigation }) {
  const { colors } = useTheme();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
        const teacherRes = await teacherService.getTeacherByUserId(user.id);
        if (teacherRes.success && teacherRes.data) {
            const teacherId = teacherRes.data.id;

            const [assignmentsRes, subjectsRes, schoolClassesRes] = await Promise.all([
                teacherService.getTeacherClasses(teacherId),
                academicService.getSubjects(),
                schoolService.getClasses()
            ]);

            if (assignmentsRes.success) {
                const subMap = {};
                if (subjectsRes.success && Array.isArray(subjectsRes.data)) {
                    subjectsRes.data.forEach(s => subMap[s.id] = s.name);
                }

                const classMap = {};
                if (schoolClassesRes.success && Array.isArray(schoolClassesRes.data)) {
                    schoolClassesRes.data.forEach(c => classMap[c.id] = c.name);
                }

                const mappedClasses = assignmentsRes.data.map(item => ({
                    ...item,
                    subjectName: subMap[item.subjectId] || `Subject ${item.subjectId}`,
                    className: classMap[item.classId] || `Class ${item.classId}`
                }));
                setClasses(mappedClasses);
            }
        } else {
            console.log('Teacher profile not found for user:', user.id);
        }
    } catch (e) {
        console.error('Error loading teacher classes:', e);
    }
    setLoading(false);
  };

  const dynamicStyles = styles(colors);

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={dynamicStyles.card}
      onPress={() => navigation.navigate('MarkAttendance', {
        classId: item.classId,
        sectionId: item.sectionId,
        subjectId: item.subjectId,
        className: item.className,
        subjectName: item.subjectName
      })}
    >
      <View style={dynamicStyles.info}>
        <Text style={dynamicStyles.className}>{item.className}</Text>
        <Text style={dynamicStyles.subject}>{item.subjectName}</Text>
        <Text style={dynamicStyles.ids}>Sub ID: {item.subjectId} | Class ID: {item.classId}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>My Classes</Text>
        <TouchableOpacity onPress={loadClasses}>
            <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={dynamicStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View style={dynamicStyles.emptyContainer}>
                <Ionicons name="school-outline" size={64} color={colors.textSecondary} />
                <Text style={dynamicStyles.empty}>No classes assigned to you.</Text>
                <Text style={dynamicStyles.emptySub}>Ask an Admin to assign subjects and classes to your profile in "Academic Setup".</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  info: { flex: 1 },
  className: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  subject: { color: colors.textSecondary, marginTop: 4, fontSize: 14, fontWeight: '500' },
  ids: { color: colors.textSecondary, fontSize: 10, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  empty: { textAlign: 'center', marginTop: 20, color: colors.text, fontSize: 18, fontWeight: 'bold' },
  emptySub: { textAlign: 'center', marginTop: 10, color: colors.textSecondary, lineHeight: 20 }
});
