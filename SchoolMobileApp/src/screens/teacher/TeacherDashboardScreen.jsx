import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../styles';
import { useAuthStore } from '../../store/authStore';
import teacherService from '../../services/teacherService';
import { useTheme } from '../../hooks/useTheme';

export default function TeacherDashboardScreen({ navigation }) {
  const user = useAuthStore(state => state.user);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [classes, setClasses] = useState([]);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const profileRes = await teacherService.getTeacherByUserId(user.id);
      if (profileRes.success) {
        setTeacherData(profileRes.data);
        const classesRes = await teacherService.getTeacherClasses(profileRes.data.id);
        if (classesRes.success) {
          setClasses(classesRes.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teacher dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const dynamicStyles = styles(colors);

  const teacherModules = [
    {
      title: 'My Classes',
      icon: 'people',
      color: '#4CAF50',
      description: 'Mark attendance and manage students',
      action: () => navigation.navigate('TeacherClasses')
    },
    {
      title: 'Grading',
      icon: 'create',
      color: '#FF9800',
      description: 'Enter scores and manage assessments',
      action: () => navigation.navigate('TeacherAssessments')
    },
    {
      title: 'Timetable',
      icon: 'calendar',
      color: '#2196F3',
      description: 'View your teaching schedule',
      action: () => navigation.navigate('TeacherTimetable')
    },
    {
      title: 'Announcements',
      icon: 'megaphone',
      color: '#9C27B0',
      description: 'Share updates with your classes',
      action: () => {}
    }
  ];

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.welcomeText}>Teacher Portal</Text>
          <Text style={dynamicStyles.subHeaderText}>Hello, {user?.firstName} {user?.lastName}</Text>
          {teacherData?.specialization && (
            <Text style={dynamicStyles.specializationText}>{teacherData.specialization} Specialist</Text>
          )}
        </View>

        <View style={dynamicStyles.grid}>
          {teacherModules.map((module, index) => (
            <TouchableOpacity
              key={index}
              style={dynamicStyles.moduleCard}
              onPress={module.action}
            >
              <View style={[dynamicStyles.iconContainer, { backgroundColor: module.color }]}>
                <Ionicons name={module.icon} size={28} color="#FFFFFF" />
              </View>
              <View style={dynamicStyles.moduleTextContainer}>
                <Text style={dynamicStyles.moduleTitle}>{module.title}</Text>
                <Text style={dynamicStyles.moduleDescription}>
                  {module.title === 'My Classes' ? `${classes.length} assigned classes` : module.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={dynamicStyles.upcomingSection}>
          <Text style={dynamicStyles.sectionTitle}>Assigned Classes</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : classes.length > 0 ? (
            classes.map((cls, index) => (
              <View key={cls.id || index} style={[dynamicStyles.nextClassCard, { marginBottom: spacing.sm }]}>
                <View style={dynamicStyles.timeLabel}>
                  <Text style={dynamicStyles.timeText}>Class</Text>
                  <Text style={dynamicStyles.timeSubText}>ID: {cls.classId}</Text>
                </View>
                <View style={dynamicStyles.classDetails}>
                  <Text style={dynamicStyles.className}>Subject ID: {cls.subjectId}</Text>
                  <Text style={dynamicStyles.classRoom}>Assigned for current year</Text>
                </View>
                <TouchableOpacity
                  style={dynamicStyles.attendanceButton}
                  onPress={() => navigation.navigate('TeacherClasses', { classId: cls.classId })}
                >
                  <Text style={dynamicStyles.attendanceButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={dynamicStyles.emptyState}>
              <Text style={dynamicStyles.emptyStateText}>No classes assigned yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subHeaderText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  specializationText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  grid: {
    gap: spacing.md,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  moduleTextContainer: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  moduleDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  upcomingSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  nextClassCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
  },
  timeLabel: {
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    alignItems: 'center',
  },
  timeText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  timeSubText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  classDetails: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  classRoom: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  attendanceButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  attendanceButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyState: {
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.textSecondary,
  }
});
