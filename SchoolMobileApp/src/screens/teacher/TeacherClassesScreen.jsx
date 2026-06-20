import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { spacing } from '../../styles';
import teacherService from '../../services/teacherService';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';

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
        // 1. Get teacher profile by logged-in user ID
        const teacherRes = await teacherService.getTeacherByUserId(user.id);
        if (teacherRes.success && teacherRes.data) {
            const teacherId = teacherRes.data.id;

            // 2. Get assignments, subjects, and classes in parallel to map names
            const [assignmentsRes, subjectsRes, schoolClassesRes] = await Promise.all([
                teacherService.getTeacherClasses(teacherId),
                academicService.getSubjects(),
                schoolService.getClasses()
            ]);

            if (assignmentsRes.success) {
                const subMap = {};
                if (subjectsRes.success) subjectsRes.data.forEach(s => subMap[s.id] = s.name);

                const classMap = {};
                if (schoolClassesRes.success) schoolClassesRes.data.forEach(c => classMap[c.id] = c.name);

                const mappedClasses = assignmentsRes.data.map(item => ({
                    ...item,
                    subjectName: subMap[item.subjectId] || `Subject ${item.subjectId}`,
                    className: classMap[item.classId] || `Class ${item.classId}`
                }));
                setClasses(mappedClasses);
            }
        } else {
            Alert.alert('Error', 'Could not find your teacher profile. Ensure you are registered as a teacher.');
        }
    } catch (e) {
        console.error(e);
    }
    setLoading(false);
  };

  const dynamicStyles = styles(colors);

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={dynamicStyles.card}
      onPress={() => navigation.navigate('MarkAttendance', { classId: item.classId, sectionId: item.sectionId })}
    >
      <View style={dynamicStyles.info}>
        <Text style={dynamicStyles.className}>{item.className}</Text>
        <Text style={dynamicStyles.subject}>{item.subjectName}</Text>
        <Text style={dynamicStyles.ids}>Sub ID: {item.subjectId} | Class ID: {item.classId}</Text>
      </View>
      <View style={dynamicStyles.badge}><Text style={dynamicStyles.badgeText}>Open</Text></View>
    </TouchableOpacity>
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>My Classes</Text>
        <TouchableOpacity onPress={loadClasses}><Text style={{color: colors.primary, fontWeight: '600'}}>Refresh</Text></TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={dynamicStyles.empty}>No classes assigned to you yet.</Text>}
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
  badge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20, color: colors.textSecondary }
});
