import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPasswordStrength, getPasswordStrengthLabel } from '../utils/validators';
import { spacing } from '../styles';
import { useTheme } from '../hooks/useTheme';

export default function PasswordStrength({ password }) {
  const { colors } = useTheme();
  const strength = getPasswordStrength(password);
  const label = getPasswordStrengthLabel(strength);
  const width = Math.min(100, (strength / 6) * 100);

  const dynamicStyles = styles(colors);

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.barBackground}>
        <View style={[dynamicStyles.barFill, { width: `${width}%` }]} />
      </View>
      <Text style={dynamicStyles.label}>{label}</Text>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { marginTop: spacing.sm, marginBottom: spacing.md },
  barBackground: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    backgroundColor: colors.primary,
  },
  label: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500'
  },
});
