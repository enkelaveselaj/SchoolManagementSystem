import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../styles';
import notificationService from '../services/notificationService';
import { useTheme } from '../hooks/useTheme';

export default function NotificationBanner() {
  const { colors } = useTheme();
  const [notification, setNotification] = useState(null);
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    const handleNotification = (data) => {
      setNotification(data);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        dismissNotification();
      }, 5000);
    };

    // Listen to all notification types
    notificationService.on('announcement', handleNotification);
    notificationService.on('grade_posted', handleNotification);
    notificationService.on('attendance_updated', handleNotification);
    notificationService.on('assessment_available', handleNotification);
    notificationService.on('assessment_graded', handleNotification);

    return () => {
      notificationService.off('announcement', handleNotification);
      notificationService.off('grade_posted', handleNotification);
      notificationService.off('attendance_updated', handleNotification);
      notificationService.off('assessment_available', handleNotification);
      notificationService.off('assessment_graded', handleNotification);
    };
  }, []);

  const dismissNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification(null);
    });
  };

  if (!notification) {
    return null;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'announcement':
        return 'megaphone';
      case 'grade_posted':
        return 'checkmark-circle';
      case 'assessment_available':
      case 'assessment_graded':
        return 'document-text';
      case 'attendance_updated':
        return 'checkmark';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'announcement':
        return '#2196F3';
      case 'grade_posted':
        return '#4CAF50';
      case 'assessment_available':
      case 'assessment_graded':
        return '#FF9800';
      case 'attendance_updated':
        return '#4CAF50';
      default:
        return colors.primary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.banner,
        { transform: [{ translateY: slideAnim }] },
        { backgroundColor: getNotificationColor(notification.type) },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={getNotificationIcon(notification.type)}
          size={24}
          color="#FFFFFF"
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{notification.title}</Text>
          {notification.message && (
            <Text style={styles.message}>{notification.message}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={dismissNotification}>
        <Ionicons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 12,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
      }
    })
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  message: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
});
