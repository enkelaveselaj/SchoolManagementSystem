import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { spacing, shadow } from '../../styles';
import academicService from '../../services/academicService';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function StudentAssessmentsScreen() {
  const { colors } = useTheme();
  const user = useAuthStore(state => state.user);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
        // We pass studentId as a query param
        const res = await academicService.getAssessments({ studentId: user.id });
        if (res.success) {
            setAssessments(res.data || []);
        }
    } catch (e) {
        console.error('Error loading assessments:', e);
    }
    setLoading(false);
  };

  const dynamicStyles = styles(colors);

  const getIcon = (type = '') => {
    switch (type.toLowerCase()) {
        case 'exam': return 'document-text';
        case 'quiz': return 'help-circle';
        case 'assignment': return 'attach';
        default: return 'list';
    }
  };

  const renderItem = ({ item }) => {
    const hasScore = item.myScore && item.myScore.score !== undefined && item.myScore.score !== null;
    const scoreVal = hasScore ? item.myScore.score : null;
    const percentage = hasScore ? (scoreVal / (item.maxScore || 100)) * 100 : 0;

    return (
      <View style={dynamicStyles.card}>
        <View style={[dynamicStyles.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={getIcon(item.type)} size={24} color={colors.primary} />
        </View>

        <View style={{flex: 1}}>
          <Text style={dynamicStyles.titleText}>{item.title || 'Untitled'}</Text>
          <Text style={dynamicStyles.subText}>{item.type || 'Assessment'} • Max: {item.maxScore || 100}</Text>
          <Text style={dynamicStyles.subjectName}>{item.subject?.name || 'Academic Subject'}</Text>
        </View>

        <View style={dynamicStyles.rightSection}>
            {hasScore ? (
                <View style={dynamicStyles.scoreContainer}>
                    <Text style={[dynamicStyles.scoreValue, { color: getScoreColor(percentage) }]}>
                        {scoreVal}
                    </Text>
                    <Text style={dynamicStyles.scoreLabel}>SCORE</Text>
                </View>
            ) : (
                <View style={dynamicStyles.dateBox}>
                    <Text style={dynamicStyles.dateLabel}>DATE</Text>
                    <Text style={dynamicStyles.dateValue}>
                        {item.date ? new Date(item.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'TBD'}
                    </Text>
                </View>
            )}
        </View>
      </View>
    );
  };

  const getScoreColor = (pct) => {
    if (pct >= 85) return '#4CAF50';
    if (pct >= 70) return '#8BC34A';
    if (pct >= 50) return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.headerContainer}>
        <Text style={dynamicStyles.header}>My Assessments</Text>
        <TouchableOpacity onPress={loadData} style={dynamicStyles.refreshBtn}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={dynamicStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{marginTop: 10, color: colors.textSecondary}}>Syncing records...</Text>
        </View>
      ) : (
        <FlatList
          data={assessments}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          ListEmptyComponent={
            <View style={dynamicStyles.center}>
                <Ionicons name="clipboard-outline" size={64} color={colors.textSecondary} />
                <Text style={dynamicStyles.emptyText}>No assessments found for your subjects.</Text>
            </View>
          }
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  header: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  refreshBtn: { padding: 8 },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow,
    elevation: 3,
  },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  titleText: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  subText: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  subjectName: { color: colors.primary, fontSize: 12, fontWeight: '700', marginTop: 4 },
  rightSection: { minWidth: 70, alignItems: 'flex-end', borderLeftWidth: 1, borderLeftColor: colors.border, paddingLeft: 12, marginLeft: 8 },
  scoreContainer: { alignItems: 'center' },
  scoreValue: { fontSize: 22, fontWeight: 'bold' },
  scoreLabel: { fontSize: 9, fontWeight: 'bold', color: colors.textSecondary, marginTop: -2 },
  dateBox: { alignItems: 'center' },
  dateLabel: { fontSize: 9, fontWeight: 'bold', color: colors.textSecondary },
  dateValue: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 20, fontSize: 16 }
});
