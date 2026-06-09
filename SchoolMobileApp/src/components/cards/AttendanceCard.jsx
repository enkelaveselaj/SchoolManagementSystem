import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../styles';

export default function AttendanceCard({ label, value, percentage, color }) {
  return (
    <View style={styles.card}>
      <View style={[styles.colorBand, { backgroundColor: color || colors.primary }]} />
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {percentage !== undefined && (
          <Text style={styles.percentage}>{percentage}%</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  colorBand: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  label: {
    fontSize: 12,
    color: colors.gray600 || '#6B7280',
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray900 || '#1F2937',
  },
  percentage: {
    fontSize: 14,
    color: colors.gray500 || '#9CA3AF',
    marginTop: spacing.xs,
  },
});

