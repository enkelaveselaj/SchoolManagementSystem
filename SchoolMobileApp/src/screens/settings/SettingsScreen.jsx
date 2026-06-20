import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { spacing } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to logout?');
      if (confirmLogout) {
        logout();
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
          },
        },
      ]);
    }
  };

  const dynamicStyles = styles(colors);

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Profile Section */}
      <View style={dynamicStyles.section}>
        <View style={dynamicStyles.profileHeader}>
          <View style={dynamicStyles.avatar}>
            <Text style={dynamicStyles.avatarText}>
              {user?.firstName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={dynamicStyles.profileInfo}>
            <Text style={dynamicStyles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={dynamicStyles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Preferences</Text>

        <View style={dynamicStyles.settingItem}>
          <View style={dynamicStyles.settingLeft}>
            <Ionicons name="notifications" size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: colors.primary }}
          />
        </View>

        <View style={dynamicStyles.settingItem}>
          <View style={dynamicStyles.settingLeft}>
            <Ionicons name="moon" size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: colors.primary }}
          />
        </View>
      </View>

      {/* About Section */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>About</Text>

        <TouchableOpacity style={dynamicStyles.settingItem}>
          <View style={dynamicStyles.settingLeft}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingLabel}>App Version</Text>
          </View>
          <Text style={dynamicStyles.settingValue}>1.0.0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.settingItem}>
          <View style={dynamicStyles.settingLeft}>
            <Ionicons name="document-text" size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingLabel}>Terms of Service</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.settingItem}>
          <View style={dynamicStyles.settingLeft}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingLabel}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={dynamicStyles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color={colors.white} />
        <Text style={dynamicStyles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.card,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.md,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
});

