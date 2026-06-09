import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPasswordStrength, getPasswordStrengthLabel } from '../utils/validators';
import { colors, spacing } from '../styles';

export default function PasswordStrength({ password }) {
  const strength = getPasswordStrength(password);
  const label = getPasswordStrengthLabel(strength);
  const width = Math.min(100, (strength / 6) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${width}%` }]} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.sm },
  barBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: colors.primary,
  },
  label: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.gray500,
  },
});

