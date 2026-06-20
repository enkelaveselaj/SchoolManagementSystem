import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useStudent } from '../../hooks/useStudent';
import AttendanceCard from '../../components/cards/AttendanceCard';
import { spacing } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

export default function AttendanceScreen() {
  const { colors } = useTheme();
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

  const dynamicStyles = styles(colors);

  if (loading && !attendance) {
    return (
      <View style={dynamicStyles.loadingContainer}>
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
      style={dynamicStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
      }
    >
      {/* Main Percentage Circle */}
      <View style={dynamicStyles.circleContainer}>
        <View style={[dynamicStyles.circle, { borderColor: getColorForPercentage(attendancePercentage) }]}>
          <Text style={dynamicStyles.circlePercentage}>{attendancePercentage}%</Text>
          <Text style={dynamicStyles.circleLabel}>Attendance</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={dynamicStyles.statsContainer}>
        <AttendanceCard label="Present" value={presentDays} color="#4CAF50" />
        <AttendanceCard label="Absent" value={absentDays} color="#F44336" />
      </View>

      {/* Attendance History */}
      {records.length > 0 && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Recent Attendance</Text>
          {records.slice(0, 10).map((record, index) => (
            <View key={index} style={dynamicStyles.recordItem}>
              <Text style={dynamicStyles.recordDate}>
                {new Date(record.date).toLocaleDateString()}
              </Text>
              <View
                style={[
                  dynamicStyles.statusBadge,
                  {
                    backgroundColor:
                      record.status === 'Present' ? '#4CAF50' : '#F44336',
                  },
                ]}
              >
                <Text style={dynamicStyles.statusText}>{record.status}</Text>
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

const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: colors.card,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
  },
  circleLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  statsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
  },
  recordDate: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
