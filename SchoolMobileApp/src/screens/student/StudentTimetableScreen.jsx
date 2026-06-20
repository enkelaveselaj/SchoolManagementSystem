import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { spacing } from '../../styles';
import academicService from '../../services/academicService';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';

export default function StudentTimetableScreen() {
  const { colors } = useTheme();
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

  const dynamicStyles = styles(colors);

  const renderItem = ({ item }) => (
    <View style={dynamicStyles.card}>
      <View style={dynamicStyles.timeInfo}>
        <Text style={dynamicStyles.day}>{item.dayOfWeek}</Text>
        <Text style={dynamicStyles.time}>{item.startTime} - {item.endTime}</Text>
      </View>
      <View style={dynamicStyles.subjectInfo}>
        <Text style={dynamicStyles.subject}>Subject ID: {item.subjectId}</Text>
        <Text style={dynamicStyles.room}>Room: {item.room}</Text>
      </View>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Your Timetable</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={timetables}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={dynamicStyles.emptyText}>No classes scheduled yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  timeInfo: { width: 110, borderRightWidth: 1, borderRightColor: colors.border, marginRight: 15 },
  day: { fontWeight: 'bold', color: colors.primary, fontSize: 16 },
  time: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  subject: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  room: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 20 }
});
