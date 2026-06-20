import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../styles';
import { useAuthStore } from '../../store/authStore';
import adminService from '../../services/adminService';
import schoolService from '../../services/schoolService';
import { useTheme } from '../../hooks/useTheme';

export default function AdminDashboardScreen({ navigation }) {
  const user = useAuthStore(state => state.user);
  const { colors } = useTheme();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const [studentsRes, teachersRes, classesRes] = await Promise.all([
        adminService.getStudents(),
        adminService.getTeachers(),
        schoolService.getClasses()
      ]);

      setStats({
        students: studentsRes.success ? studentsRes.data.length : 0,
        teachers: teachersRes.success ? teachersRes.data.length : 0,
        classes: classesRes.success ? classesRes.data.length : 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const dynamicStyles = styles(colors);

  const adminModules = [
    {
      title: 'User Management',
      icon: 'people',
      color: '#4CAF50',
      description: 'Manage students, teachers, and parents',
      action: () => navigation.navigate('UserManagement')
    },
    {
      title: 'Class Management',
      icon: 'business',
      color: '#2196F3',
      description: 'Setup classes and sections',
      action: () => navigation.navigate('ClassManagement')
    },
    {
      title: 'Section Management',
      icon: 'layers',
      color: '#00BCD4',
      description: 'Organize student groups',
      action: () => navigation.navigate('SectionManagement')
    },
    {
      title: 'Student Enrollment',
      icon: 'school',
      color: '#F44336',
      description: 'Assign students to classes',
      action: () => navigation.navigate('StudentEnrollment')
    },
    {
      title: 'Academic Setup',
      icon: 'book',
      color: '#9C27B0',
      description: 'Subjects and teacher assignments',
      action: () => navigation.navigate('AcademicSetup')
    },
    {
      title: 'Communications',
      icon: 'megaphone',
      color: '#FF9800',
      description: 'Send announcements and notifications',
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
          <Text style={dynamicStyles.welcomeText}>Admin Dashboard</Text>
          <Text style={dynamicStyles.subHeaderText}>Welcome back, {user?.firstName}</Text>
        </View>

        <View style={dynamicStyles.grid}>
          {adminModules.map((module, index) => (
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
                <Text style={dynamicStyles.moduleDescription}>{module.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={dynamicStyles.statsSection}>
          <Text style={dynamicStyles.sectionTitle}>Quick Stats</Text>
          <View style={dynamicStyles.statsRow}>
            <View style={dynamicStyles.statBox}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={dynamicStyles.statNumber}>{stats.students}</Text>
              )}
              <Text style={dynamicStyles.statLabel}>Students</Text>
            </View>
            <View style={dynamicStyles.statBox}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={dynamicStyles.statNumber}>{stats.teachers}</Text>
              )}
              <Text style={dynamicStyles.statLabel}>Teachers</Text>
            </View>
            <View style={dynamicStyles.statBox}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={dynamicStyles.statNumber}>{stats.classes}</Text>
              )}
              <Text style={dynamicStyles.statLabel}>Classes</Text>
            </View>
          </View>
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
  statsSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
