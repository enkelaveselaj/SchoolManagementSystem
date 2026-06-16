import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors, spacing } from '../../styles';
import teacherService from '../../services/teacherService';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';
import { useAuthStore } from '../../store/authStore';

export default function TeacherClassesScreen({ navigation }) {
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

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MarkAttendance', { classId: item.classId, sectionId: item.sectionId })}
    >
      <View style={styles.info}>
        <Text style={styles.className}>{item.className}</Text>
        <Text style={styles.subject}>{item.subjectName}</Text>
        <Text style={styles.ids}>Sub ID: {item.subjectId} | Class ID: {item.classId}</Text>
      </View>
      <View style={styles.badge}><Text style={styles.badgeText}>Open</Text></View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Classes</Text>
        <TouchableOpacity onPress={loadClasses}><Text style={{color: colors.primary}}>Refresh</Text></TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={styles.empty}>No classes assigned to you yet.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100, padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  info: { flex: 1 },
  className: { fontSize: 18, fontWeight: 'bold' },
  subject: { color: colors.gray500, marginTop: 4, fontSize: 14 },
  ids: { color: colors.gray500, fontSize: 10, marginTop: 4 },
  badge: { backgroundColor: colors.primary, padding: 8, borderRadius: 8 },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20, color: colors.gray500 }
});
