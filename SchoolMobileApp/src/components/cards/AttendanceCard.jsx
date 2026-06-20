import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

export default function AttendanceCard({ label, value, percentage, color }) {
  const { colors } = useTheme();
  const dynamicStyles = styles(colors);

  return (
    <View style={dynamicStyles.card}>
      <View style={[dynamicStyles.colorBand, { backgroundColor: color || colors.primary }]} />
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.label}>{label}</Text>
        <Text style={dynamicStyles.value}>{value}</Text>
        {percentage !== undefined && (
          <Text style={dynamicStyles.percentage}>{percentage}%</Text>
        )}
      </View>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  colorBand: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  percentage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
