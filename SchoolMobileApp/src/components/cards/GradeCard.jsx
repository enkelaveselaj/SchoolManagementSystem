import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

export default function GradeCard({ subject, grade, date }) {
  const { colors } = useTheme();
  const getGradeColor = (grade) => {
    if (grade >= 9) return '#4CAF50';
    if (grade >= 8) return '#8BC34A';
    if (grade >= 7) return '#FFC107';
    if (grade >= 6) return '#FF9800';
    return '#F44336';
  };

  const dynamicStyles = styles(colors);

  return (
    <View style={dynamicStyles.card}>
      <View style={dynamicStyles.info}>
        <Text style={dynamicStyles.subject}>{subject}</Text>
        <Text style={dynamicStyles.date}>{new Date(date).toLocaleDateString()}</Text>
      </View>
      <View style={[dynamicStyles.gradeBox, { backgroundColor: getGradeColor(grade) }]}>
        <Text style={dynamicStyles.gradeText}>{grade}</Text>
      </View>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  gradeBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
