import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import teacherService from '../../services/teacherService';
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
    // In a real scenario, we would first get the teacherId linked to the userId
    const teacherRes = await teacherService.getTeacherByUserId(user.id);
    if (teacherRes.success && teacherRes.data) {
        const classesRes = await teacherService.getTeacherClasses(teacherRes.data.id);
        if (classesRes.success) setClasses(classesRes.data);
    }
    setLoading(false);
  };

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MarkAttendance', { classId: item.classId, sectionId: item.sectionId })}
    >
      <View style={styles.info}>
        <Text style={styles.className}>{item.className} - {item.sectionName}</Text>
        <Text style={styles.subject}>{item.subjectName}</Text>
      </View>
      <View style={styles.badge}><Text style={styles.badgeText}>Attendance</Text></View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Classes</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={item => `${item.classId}-${item.sectionId}`}
          ListEmptyComponent={<Text style={styles.empty}>No classes assigned yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  card: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  className: { fontSize: 18, fontWeight: 'bold' },
  subject: { color: colors.gray500, marginTop: 4 },
  badge: { backgroundColor: colors.primary, padding: 8, borderRadius: 8 },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20, color: colors.gray500 }
});
