import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';
import { useAuthStore } from '../../store/authStore';

export default function AdminDashboardScreen({ navigation }) {
  const user = useAuthStore(state => state.user);

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Admin Dashboard</Text>
          <Text style={styles.subHeaderText}>Welcome back, {user?.firstName}</Text>
        </View>

        <View style={styles.grid}>
          {adminModules.map((module, index) => (
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

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>1,240</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>85</Text>
              <Text style={styles.statLabel}>Teachers</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>
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
  statsSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.black,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.white,
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
    color: colors.gray500,
    marginTop: 4,
  },
});
