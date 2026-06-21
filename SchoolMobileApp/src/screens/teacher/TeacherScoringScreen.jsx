import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { spacing, shadow } from '../../styles';
import academicService from '../../services/academicService';
import studentManagementService from '../../services/studentManagementService';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherScoringScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { assessmentId, assessmentTitle, subjectId, maxScore } = route.params;
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({}); // { studentId: score }
  const [remarks, setRemarks] = useState({}); // { studentId: remark }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const limit = parseInt(maxScore) || 100;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
        const [stdRes, scoresRes] = await Promise.all([
          studentManagementService.getAllStudents(),
          academicService.getAssessmentScores(assessmentId)
        ]);

        if (stdRes.success) {
            setStudents(stdRes.data);
        }

        if (scoresRes.success) {
          const existingScores = {};
          const existingRemarks = {};
          scoresRes.data.forEach(s => {
            if (s.studentId) {
                existingScores[s.studentId] = s.score.toString();
                existingRemarks[s.studentId] = s.remarks || '';
            }
          });
          setScores(existingScores);
          setRemarks(existingRemarks);
        }
    } catch (err) {
        console.error('Error loading scoring data:', err);
    }
    setLoading(false);
  };

  const handleBatchSave = async () => {
    const studentIds = Object.keys(scores);
    if (studentIds.length === 0) return Alert.alert('Error', 'No scores entered');

    const scoreRecords = studentIds.map(id => ({
        studentId: parseInt(id),
        score: parseFloat(scores[id]),
        remarks: remarks[id] || ''
    })).filter(r => !isNaN(r.score));

    if (scoreRecords.length === 0) return Alert.alert('Error', 'Please enter valid numbers for scores');

    // Validate scores against max marks
    const invalid = scoreRecords.find(r => r.score > limit);
    if (invalid) return Alert.alert('Error', `Score for ID ${invalid.studentId} exceeds max marks (${limit})`);

    setSaving(true);
    try {
        const res = await academicService.submitScore({
            assessmentId: parseInt(assessmentId),
            scores: scoreRecords
        });

        if (res.success) {
            if (Platform.OS === 'web') alert('Scores saved successfully');
            else Alert.alert('Success', 'All scores saved successfully');
            navigation.goBack();
        } else {
            throw new Error(res.error);
        }
    } catch (e) {
        Alert.alert('Error', e.message || 'Failed to save scores');
    }
    setSaving(false);
  };

  const filteredStudents = useMemo(() => {
    if (!search) return students;
    return students.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toString().includes(search)
    );
  }, [students, search]);

  const dynamicStyles = styles(colors);

  const renderItem = ({ item }) => {
    const score = parseFloat(scores[item.id] || 0);
    const percentage = (score / limit) * 100;
    let scoreColor = colors.text;
    if (percentage >= 80) scoreColor = '#4CAF50';
    else if (percentage < 50 && scores[item.id]) scoreColor = '#F44336';

    return (
      <View style={dynamicStyles.item}>
        <View style={dynamicStyles.studentRow}>
            <View style={dynamicStyles.avatar}>
                <Text style={dynamicStyles.avatarText}>{item.firstName?.[0]}{item.lastName?.[0]}</Text>
            </View>
            <View style={{flex: 1}}>
                <Text style={dynamicStyles.name}>{item.firstName} {item.lastName}</Text>
                <Text style={dynamicStyles.idText}>ID: {item.id}</Text>
            </View>
            <View style={dynamicStyles.inputContainer}>
                <TextInput
                    style={[dynamicStyles.scoreInput, { color: scoreColor }]}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    value={scores[item.id] || ''}
                    onChangeText={t => setScores({...scores, [item.id]: t})}
                    keyboardType="numeric"
                    maxLength={5}
                />
                <Text style={dynamicStyles.maxMarksText}>/ {limit}</Text>
            </View>
        </View>
        <TextInput
            style={dynamicStyles.remarksInput}
            placeholder="Add remarks..."
            placeholderTextColor={colors.textSecondary}
            value={remarks[item.id] || ''}
            onChangeText={t => setRemarks({...remarks, [item.id]: t})}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={dynamicStyles.container}
    >
      <View style={dynamicStyles.header}>
        <View>
            <Text style={dynamicStyles.title}>Scoring</Text>
            <Text style={dynamicStyles.subtitle}>{assessmentTitle}</Text>
        </View>
        <View style={dynamicStyles.searchBox}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
                style={dynamicStyles.searchInput}
                placeholder="Search students..."
                value={search}
                onChangeText={setSearch}
            />
        </View>
      </View>

      {loading ? (
        <View style={dynamicStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <FlatList
            data={filteredStudents}
            keyExtractor={item => item.id?.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
                <View style={dynamicStyles.center}>
                    <Text style={dynamicStyles.empty}>No students found</Text>
                </View>
            }
            contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}
          />

          <View style={dynamicStyles.footer}>
            <TouchableOpacity
                style={[dynamicStyles.saveButton, saving && { opacity: 0.7 }]}
                onPress={handleBatchSave}
                disabled={saving}
            >
                {saving ? <ActivityIndicator color="#FFF" /> : (
                    <>
                        <Ionicons name="save" size={20} color="#FFF" style={{marginRight: 8}} />
                        <Text style={dynamicStyles.saveButtonText}>Save All Scores</Text>
                    </>
                )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 14, color: colors.primary, fontWeight: '600', marginTop: 2 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 15,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border
  },
  searchInput: { flex: 1, marginLeft: 8, color: colors.text, fontSize: 14 },
  item: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: 12,
    ...shadow,
    elevation: 2,
  },
  studentRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: colors.primary, fontWeight: 'bold' },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  idText: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 10, height: 45, borderWidth: 1, borderColor: colors.border },
  scoreInput: { fontSize: 18, fontWeight: 'bold', minWidth: 40, textAlign: 'right' },
  maxMarksText: { fontSize: 14, color: colors.textSecondary, marginLeft: 4 },
  remarksInput: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 12, paddingTop: 8, color: colors.text, fontSize: 13 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  saveButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  empty: { color: colors.textSecondary }
});
