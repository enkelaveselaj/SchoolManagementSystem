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
import { spacing } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();
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

  const dynamicStyles = styles(colors);

  if (!dashboardData && loading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
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
      style={dynamicStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
      }
    >
      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.greeting}>Welcome, {user?.firstName}!</Text>
        <Text style={dynamicStyles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Quick Stats Grid */}
      <View style={dynamicStyles.statsGrid}>
        <TouchableOpacity
          style={dynamicStyles.statCard}
          onPress={() => navigation.navigate('Attendance')}
        >
          <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
          <Text style={dynamicStyles.statValue}>{attendancePercentage}%</Text>
          <Text style={dynamicStyles.statLabel}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.statCard}
          onPress={() => navigation.navigate('Grades')}
        >
          <Ionicons name="document-text" size={32} color={colors.primary} />
          <Text style={dynamicStyles.statValue}>{averageGrade.toFixed(1)}</Text>
          <Text style={dynamicStyles.statLabel}>Avg Grade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.statCard}
          onPress={() => navigation.navigate('Assessments')}
        >
          <Ionicons name="list" size={32} color="#FF9800" />
          <Text style={dynamicStyles.statValue}>{pendingAssessments}</Text>
          <Text style={dynamicStyles.statLabel}>Assessments</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={dynamicStyles.quickActions}>
        <TouchableOpacity style={dynamicStyles.actionBtn} onPress={() => navigation.navigate('Timetable')}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={dynamicStyles.actionLabel}>Timetable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.actionBtn} onPress={() => navigation.navigate('Announcements')}>
            <Ionicons name="megaphone" size={24} color={colors.primary} />
            <Text style={dynamicStyles.actionLabel}>News</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Grades Section */}
      {recentGrades && recentGrades.length > 0 && (
        <View style={dynamicStyles.section}>
          <View style={dynamicStyles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>Recent Grades</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Grades')}>
              <Text style={dynamicStyles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentGrades.slice(0, 3).map((grade, index) => (
            <View key={index} style={dynamicStyles.gradeItem}>
              <View style={dynamicStyles.gradeInfo}>
                <Text style={dynamicStyles.subject}>{grade.subject}</Text>
                <Text style={dynamicStyles.gradeDate}>
                  {new Date(grade.date).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={[
                  dynamicStyles.gradeScore,
                  { backgroundColor: getGradeColor(grade.grade) },
                ]}
              >
                <Text style={dynamicStyles.gradeScoreText}>{grade.grade}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Upcoming Classes Section */}
      {upcomingTimetable && upcomingTimetable.length > 0 && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Today's Classes</Text>
          {upcomingTimetable.map((session, index) => (
            <View key={index} style={dynamicStyles.classItem}>
              <Ionicons
                name="time"
                size={20}
                color={colors.primary}
                style={dynamicStyles.classIcon}
              />
              <View style={dynamicStyles.classInfo}>
                <Text style={dynamicStyles.className}>{session.subject}</Text>
                <Text style={dynamicStyles.classTime}>
                  {session.time} • Room {session.room}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Latest Announcements Section */}
      {latestAnnouncements && latestAnnouncements.length > 0 && (
        <View style={dynamicStyles.section}>
          <View style={dynamicStyles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>Latest Announcements</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
              <Text style={dynamicStyles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {latestAnnouncements.slice(0, 3).map((announcement, index) => (
            <View key={index} style={dynamicStyles.announcementItem}>
              <Ionicons
                name="megaphone"
                size={20}
                color="#2196F3"
                style={dynamicStyles.announcementIcon}
              />
              <View style={dynamicStyles.announcementInfo}>
                <Text style={dynamicStyles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Text style={dynamicStyles.announcementDate}>
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
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  date: {
    color: 'rgba(255,255,255,0.8)',
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
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  quickActions: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: 12, marginBottom: 24 },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionLabel: { fontSize: 13, fontWeight: '700', marginTop: 8, color: colors.text },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
  },
  gradeInfo: {
    flex: 1,
  },
  subject: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  gradeDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  gradeScore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeScoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
  },
  classIcon: {
    marginRight: 16,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  classTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  announcementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  announcementIcon: {
    marginRight: 16,
  },
  announcementInfo: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  announcementDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
