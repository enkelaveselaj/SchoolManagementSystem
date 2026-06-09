import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useStudent } from '../../hooks/useStudent';
import AttendanceCard from '../../components/cards/AttendanceCard';
import { colors, spacing } from '../../styles';

export default function AttendanceScreen() {
  const { attendance, loading, fetchAttendance, fetchAttendanceStats } = useStudent();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAttendance();
    loadStats();
  }, []);

  const loadStats = async () => {
    const statsData = await fetchAttendanceStats();
    setStats(statsData);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAttendance();
    await loadStats();
    setRefreshing(false);
  };

  if (loading && !attendance) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const attendancePercentage = attendance?.percentage || 0;
  const presentDays = attendance?.present || 0;
  const absentDays = attendance?.absent || 0;
  const records = attendance?.records || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Main Percentage Circle */}
      <View style={styles.circleContainer}>
        <View style={[styles.circle, { borderColor: getColorForPercentage(attendancePercentage) }]}>
          <Text style={styles.circlePercentage}>{attendancePercentage}%</Text>
          <Text style={styles.circleLabel}>Attendance</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <AttendanceCard label="Present" value={presentDays} color="#4CAF50" />
        <AttendanceCard label="Absent" value={absentDays} color="#F44336" />
      </View>

      {/* Attendance History */}
      {records.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Attendance</Text>
          {records.slice(0, 10).map((record, index) => (
            <View key={index} style={styles.recordItem}>
              <Text style={styles.recordDate}>
                {new Date(record.date).toLocaleDateString()}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      record.status === 'Present' ? '#4CAF50' : '#F44336',
                  },
                ]}
              >
                <Text style={styles.statusText}>{record.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function getColorForPercentage(percentage) {
  if (percentage >= 80) return '#4CAF50';
  if (percentage >= 70) return '#FFC107';
  if (percentage >= 60) return '#FF9800';
  return '#F44336';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100 || '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: colors.white,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  circleLabel: {
    fontSize: 16,
    color: colors.gray600 || '#6B7280',
    marginTop: 8,
  },
  statsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.gray900 || '#1F2937',
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
  },
  recordDate: {
    fontSize: 14,
    color: colors.gray900 || '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

