import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudent } from '../../hooks/useStudent';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing } from '../../styles';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { dashboardData, loading, fetchDashboard } = useStudent();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  if (!dashboardData && loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const {
    attendancePercentage = 0,
    averageGrade = 0,
    pendingAssessments = 0,
    recentGrades = [],
    upcomingTimetable = [],
    latestAnnouncements = [],
  } = dashboardData || {};

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.firstName}!</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Attendance')}
        >
          <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>{attendancePercentage}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Grades')}
        >
          <Ionicons name="document-text" size={32} color={colors.primary} />
          <Text style={styles.statValue}>{averageGrade.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Grade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Assessments')}
        >
          <Ionicons name="list" size={32} color="#FF9800" />
          <Text style={styles.statValue}>{pendingAssessments}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Grades Section */}
      {recentGrades && recentGrades.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Grades</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Grades')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentGrades.slice(0, 3).map((grade, index) => (
            <View key={index} style={styles.gradeItem}>
              <View style={styles.gradeInfo}>
                <Text style={styles.subject}>{grade.subject}</Text>
                <Text style={styles.gradeDate}>
                  {new Date(grade.date).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={[
                  styles.gradeScore,
                  { backgroundColor: getGradeColor(grade.grade) },
                ]}
              >
                <Text style={styles.gradeScoreText}>{grade.grade}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Upcoming Classes Section */}
      {upcomingTimetable && upcomingTimetable.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          {upcomingTimetable.map((session, index) => (
            <View key={index} style={styles.classItem}>
              <Ionicons
                name="time"
                size={20}
                color={colors.primary}
                style={styles.classIcon}
              />
              <View style={styles.classInfo}>
                <Text style={styles.className}>{session.subject}</Text>
                <Text style={styles.classTime}>
                  {session.time} • Room {session.room}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Latest Announcements Section */}
      {latestAnnouncements && latestAnnouncements.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Announcements</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {latestAnnouncements.slice(0, 3).map((announcement, index) => (
            <View key={index} style={styles.announcementItem}>
              <Ionicons
                name="megaphone"
                size={20}
                color="#2196F3"
                style={styles.announcementIcon}
              />
              <View style={styles.announcementInfo}>
                <Text style={styles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Text style={styles.announcementDate}>
                  {new Date(announcement.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function getGradeColor(grade) {
  if (grade >= 9) return '#4CAF50';
  if (grade >= 8) return '#8BC34A';
  if (grade >= 7) return '#FFC107';
  if (grade >= 6) return '#FF9800';
  return '#F44336';
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100 || '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  date: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray900 || '#1F2937',
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray600 || '#6B7280',
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray900 || '#1F2937',
  },
  seeAll: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
  },
  gradeInfo: {
    flex: 1,
  },
  subject: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900 || '#1F2937',
  },
  gradeDate: {
    fontSize: 12,
    color: colors.gray600 || '#6B7280',
    marginTop: spacing.xs,
  },
  gradeScore: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeScoreText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
  },
  classIcon: {
    marginRight: spacing.md,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900 || '#1F2937',
  },
  classTime: {
    fontSize: 12,
    color: colors.gray600 || '#6B7280',
    marginTop: spacing.xs,
  },
  announcementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  announcementIcon: {
    marginRight: spacing.md,
  },
  announcementInfo: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900 || '#1F2937',
  },
  announcementDate: {
    fontSize: 12,
    color: colors.gray600 || '#6B7280',
    marginTop: spacing.xs,
  },
});

