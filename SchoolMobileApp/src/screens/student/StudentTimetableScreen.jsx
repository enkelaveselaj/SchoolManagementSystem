import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import academicService from '../../services/academicService';
import { useAuthStore } from '../../store/authStore';

export default function StudentTimetableScreen() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Ideally we filter by student's classId
    const res = await academicService.getTimetables();
    if (res.success) setTimetables(res.data);
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.timeInfo}>
        <Text style={styles.day}>{item.dayOfWeek}</Text>
        <Text style={styles.time}>{item.startTime} - {item.endTime}</Text>
      </View>
      <View style={styles.subjectInfo}>
        <Text style={styles.subject}>Subject ID: {item.subjectId}</Text>
        <Text style={styles.room}>Room: {item.room}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Timetable</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={timetables}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text>No classes scheduled yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  card: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.md, flexDirection: 'row', elevation: 2 },
  timeInfo: { width: 120, borderRightWidth: 1, borderRightColor: '#eee', marginRight: 15 },
  day: { fontWeight: 'bold', color: colors.primary },
  time: { fontSize: 12, color: colors.gray500, marginTop: 4 },
  subject: { fontSize: 16, fontWeight: 'bold' },
  room: { fontSize: 14, color: colors.gray500, marginTop: 4 }
});
