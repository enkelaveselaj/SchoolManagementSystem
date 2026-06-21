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
import { useAuthStore } from '../../store/authStore';
import { spacing, shadow } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

export default function DashboardScreen({ navigation }) {
  const user = useAuthStore(state => state.user);
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
  } = dashboardData || {};

  return (
    <ScrollView
      style={dynamicStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
      }
    >
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.greeting}>Hello, {user?.firstName}!</Text>
        <Text style={dynamicStyles.date}>
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={dynamicStyles.statsGrid}>
        <TouchableOpacity
          style={dynamicStyles.statCard}
          onPress={() => navigation.navigate('Attendance')}
        >
          <View style={[dynamicStyles.iconCircle, {backgroundColor: '#4CAF5015'}]}>
            <Ionicons name="calendar" size={24} color="#4CAF50" />
          </View>
          <Text style={dynamicStyles.statValue}>{Math.round(attendancePercentage)}%</Text>
          <Text style={dynamicStyles.statLabel}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.statCard}
          onPress={() => navigation.navigate('Grades')}
        >
          <View style={[dynamicStyles.iconCircle, {backgroundColor: colors.primary + '15'}]}>
            <Ionicons name="star" size={24} color={colors.primary} />
          </View>
          <Text style={dynamicStyles.statValue}>{averageGrade > 0 ? averageGrade.toFixed(1) : 'N/A'}</Text>
          <Text style={dynamicStyles.statLabel}>Avg Score</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.statCard}
          onPress={() => navigation.navigate('Assessments')}
        >
          <View style={[dynamicStyles.iconCircle, {backgroundColor: '#FF980015'}]}>
            <Ionicons name="clipboard" size={24} color="#FF9800" />
          </View>
          <Text style={dynamicStyles.statValue}>{pendingAssessments}</Text>
          <Text style={dynamicStyles.statLabel}>Assessments</Text>
        </TouchableOpacity>
      </View>

      {recentGrades.length > 0 && (
        <View style={dynamicStyles.section}>
          <View style={dynamicStyles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>Recent Results</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Grades')}>
              <Text style={dynamicStyles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentGrades.map((grade, index) => (
            <View key={index} style={dynamicStyles.gradeItem}>
              <View style={dynamicStyles.gradeInfo}>
                <Text style={dynamicStyles.subject}>{grade.subject}</Text>
                <Text style={dynamicStyles.gradeDate}>
                  {new Date(grade.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[dynamicStyles.scoreText, { color: getGradeColor(grade.grade) }]}>
                {grade.grade}
              </Text>
            </View>
          ))}
        </View>
      )}

      {upcomingTimetable.length > 0 ? (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Today's Schedule</Text>
          {upcomingTimetable.map((session, index) => (
            <View key={index} style={dynamicStyles.classItem}>
              <View style={dynamicStyles.timeBadge}>
                <Text style={dynamicStyles.timeText}>{session.time.split(' - ')[0]}</Text>
              </View>
              <View style={dynamicStyles.classInfo}>
                <Text style={dynamicStyles.className}>{session.subject}</Text>
                <Text style={dynamicStyles.classRoom}>Room {session.room}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Schedule</Text>
            <View style={dynamicStyles.emptyCard}>
                <Text style={{color: colors.textSecondary}}>No classes scheduled for today.</Text>
            </View>
        </View>
      )}
    </ScrollView>
  );
}

function getGradeColor(grade) {
  if (grade >= 90) return '#4CAF50';
  if (grade >= 80) return '#8BC34A';
  if (grade >= 70) return '#FFC107';
  if (grade >= 60) return '#FF9800';
  return '#F44336';
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: { fontSize: 26, fontWeight: 'bold', color: colors.text },
  date: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  statsGrid: { flexDirection: 'row', padding: spacing.lg, gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    ...shadow,
    elevation: 3,
  },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2, fontWeight: '600' },
  section: { paddingHorizontal: spacing.lg, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  seeAll: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 10,
    borderRadius: 16,
    ...shadow,
    elevation: 1,
  },
  gradeInfo: { flex: 1 },
  subject: { fontSize: 15, fontWeight: '700', color: colors.text },
  gradeDate: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  scoreText: { fontSize: 20, fontWeight: 'bold' },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 10,
    borderRadius: 16,
    ...shadow,
    elevation: 1,
  },
  timeBadge: { backgroundColor: colors.primary + '15', padding: 10, borderRadius: 12, marginRight: 16, minWidth: 60, alignItems: 'center' },
  timeText: { color: colors.primary, fontWeight: 'bold', fontSize: 12 },
  classInfo: { flex: 1 },
  className: { fontSize: 15, fontWeight: '700', color: colors.text },
  classRoom: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  emptyCard: { backgroundColor: colors.card, padding: 20, borderRadius: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: colors.border }
});
