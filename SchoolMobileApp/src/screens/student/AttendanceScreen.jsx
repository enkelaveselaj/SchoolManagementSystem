import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useStudent } from '../../hooks/useStudent';
import AttendanceCard from '../../components/cards/AttendanceCard';
import { spacing, shadow } from '../../styles';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function AttendanceScreen() {
  const { colors } = useTheme();
  const { attendanceRecords, attendanceStats, loading, fetchAttendance, fetchAttendanceStats } = useStudent();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAttendance();
    fetchAttendanceStats();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAttendance(), fetchAttendanceStats()]);
    setRefreshing(false);
  };

  const dynamicStyles = styles(colors);

  if (loading && !attendanceRecords.length && !attendanceStats) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const attendancePercentage = attendanceStats?.attendanceRate || 0;
  const presentDays = attendanceStats?.presentCount || 0;
  const absentDays = attendanceStats?.absentCount || 0;
  const lateDays = attendanceStats?.lateCount || 0;

  return (
    <ScrollView
      style={dynamicStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
      }
    >
      <View style={dynamicStyles.circleContainer}>
        <View style={[dynamicStyles.circle, { borderColor: getColorForPercentage(attendancePercentage) }]}>
          <Text style={dynamicStyles.circlePercentage}>{Math.round(attendancePercentage)}%</Text>
          <Text style={dynamicStyles.circleLabel}>Overall Presence</Text>
        </View>
      </View>

      <View style={dynamicStyles.statsContainer}>
        <View style={dynamicStyles.statsRow}>
            <AttendanceCard label="Present" value={presentDays} color="#4CAF50" />
            <AttendanceCard label="Absent" value={absentDays} color="#F44336" />
            <AttendanceCard label="Late" value={lateDays} color="#FF9800" />
        </View>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Attendance History</Text>
        {attendanceRecords.length > 0 ? (
          attendanceRecords.map((record, index) => (
            <View key={record.id || index} style={dynamicStyles.recordItem}>
              <View>
                <Text style={dynamicStyles.recordDate}>
                    {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </Text>
                <Text style={dynamicStyles.subjectName}>{record.subject?.name || 'General'}</Text>
              </View>
              <View
                style={[
                  dynamicStyles.statusBadge,
                  { backgroundColor: getStatusColor(record.status) },
                ]}
              >
                <Text style={dynamicStyles.statusText}>{record.status.toUpperCase()}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={dynamicStyles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
            <Text style={dynamicStyles.emptyText}>No attendance records found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function getColorForPercentage(percentage) {
  if (percentage >= 80) return '#4CAF50';
  if (percentage >= 70) return '#FFC107';
  if (percentage >= 60) return '#FF9800';
  return '#F44336';
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'present': return '#4CAF50';
        case 'absent': return '#F44336';
        case 'late': return '#FF9800';
        case 'excused': return '#2196F3';
        default: return '#9E9E9E';
    }
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  circleContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.card,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadow,
    elevation: 4,
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePercentage: { fontSize: 36, fontWeight: 'bold', color: colors.text },
  circleLabel: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  statsContainer: { padding: spacing.md },
  statsRow: { flexDirection: 'row', gap: 10 },
  section: { padding: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, color: colors.text },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    marginBottom: 10,
    borderRadius: 16,
    ...shadow,
    elevation: 2,
  },
  recordDate: { fontSize: 14, color: colors.text, fontWeight: '700' },
  subjectName: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.textSecondary, marginTop: 10 }
});
