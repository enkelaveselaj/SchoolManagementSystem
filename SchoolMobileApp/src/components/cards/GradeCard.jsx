import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../styles';

export default function GradeCard({ subject, grade, date }) {
  const getGradeColor = (grade) => {
    if (grade >= 9) return '#4CAF50';
    if (grade >= 8) return '#8BC34A';
    if (grade >= 7) return '#FFC107';
    if (grade >= 6) return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.subject}>{subject}</Text>
        <Text style={styles.date}>{new Date(date).toLocaleDateString()}</Text>
      </View>
      <View style={[styles.gradeBox, { backgroundColor: getGradeColor(grade) }]}>
        <Text style={styles.gradeText}>{grade}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900 || '#1F2937',
  },
  date: {
    fontSize: 12,
    color: colors.gray600 || '#6B7280',
    marginTop: spacing.xs,
  },
  gradeBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

