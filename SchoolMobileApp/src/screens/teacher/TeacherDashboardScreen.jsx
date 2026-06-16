import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';
import { useAuthStore } from '../../store/authStore';

export default function TeacherDashboardScreen({ navigation }) {
  const user = useAuthStore(state => state.user);

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Teacher Portal</Text>
          <Text style={styles.subHeaderText}>Hello, {user?.firstName}</Text>
        </View>

        <View style={styles.grid}>
          {teacherModules.map((module, index) => (
            <TouchableOpacity
              key={index}
              style={styles.moduleCard}
              onPress={module.action}
            >
              <View style={[styles.iconContainer, { backgroundColor: module.color }]}>
                <Ionicons name={module.icon} size={28} color={colors.white} />
              </View>
              <View style={styles.moduleTextContainer}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray500} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Next Class</Text>
          <View style={styles.nextClassCard}>
            <View style={styles.timeLabel}>
              <Text style={styles.timeText}>10:30 AM</Text>
            </View>
            <View style={styles.classDetails}>
              <Text style={styles.className}>Mathematics - Grade 10A</Text>
              <Text style={styles.classRoom}>Room 204 • 28 Students</Text>
            </View>
            <TouchableOpacity style={styles.attendanceButton}>
              <Text style={styles.attendanceButtonText}>Mark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
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
    color: colors.black,
  },
  subHeaderText: {
    fontSize: 16,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  grid: {
    gap: spacing.md,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
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
    color: colors.black,
  },
  moduleDescription: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  upcomingSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.black,
  },
  nextClassCard: {
    backgroundColor: colors.white,
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
    borderRightColor: colors.gray100,
  },
  timeText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  classDetails: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  classRoom: {
    fontSize: 12,
    color: colors.gray500,
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
});
