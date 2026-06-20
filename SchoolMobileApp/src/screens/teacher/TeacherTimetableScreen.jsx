import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { spacing } from '../../styles';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';
import { useTheme } from '../../hooks/useTheme';

export default function TeacherTimetableScreen() {
  const { colors } = useTheme();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    classId: '',
    sectionId: '',
    teacherId: '',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    room: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleCreate = async () => {
    if (!formData.subjectId || !formData.classId || !formData.room) {
      return Alert.alert('Error', 'Please fill all required fields');
    }

    setLoading(true);
    const res = await academicService.createTimetable(formData);
    setLoading(false);

    if (res.success) {
      Alert.alert('Success', 'Timetable entry created');
      loadTimetables();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const loadTimetables = async () => {
    setLoading(true);
    const res = await academicService.getTimetables();
    if (res.success) setTimetables(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadTimetables();
  }, []);

  const dynamicStyles = styles(colors);

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
      <Text style={dynamicStyles.title}>Manage Timetable</Text>

      <View style={dynamicStyles.form}>
        <TextInput
          style={dynamicStyles.input}
          placeholder="Subject ID"
          placeholderTextColor={colors.textSecondary}
          value={formData.subjectId}
          onChangeText={t => setFormData({...formData, subjectId: t})}
          keyboardType="numeric"
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Class ID"
          placeholderTextColor={colors.textSecondary}
          value={formData.classId}
          onChangeText={t => setFormData({...formData, classId: t})}
          keyboardType="numeric"
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Section ID"
          placeholderTextColor={colors.textSecondary}
          value={formData.sectionId}
          onChangeText={t => setFormData({...formData, sectionId: t})}
          keyboardType="numeric"
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Teacher ID"
          placeholderTextColor={colors.textSecondary}
          value={formData.teacherId}
          onChangeText={t => setFormData({...formData, teacherId: t})}
          keyboardType="numeric"
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Room"
          placeholderTextColor={colors.textSecondary}
          value={formData.room}
          onChangeText={t => setFormData({...formData, room: t})}
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Start Time (HH:MM)"
          placeholderTextColor={colors.textSecondary}
          value={formData.startTime}
          onChangeText={t => setFormData({...formData, startTime: t})}
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="End Time (HH:MM)"
          placeholderTextColor={colors.textSecondary}
          value={formData.endTime}
          onChangeText={t => setFormData({...formData, endTime: t})}
        />

        <Text style={dynamicStyles.label}>Day</Text>
        <View style={dynamicStyles.daysRow}>
            {days.slice(0, 5).map(d => (
                <TouchableOpacity
                    key={d}
                    style={[dynamicStyles.dayBtn, formData.dayOfWeek === d && dynamicStyles.dayBtnActive]}
                    onPress={() => setFormData({...formData, dayOfWeek: d})}
                >
                    <Text style={[dynamicStyles.dayBtnText, formData.dayOfWeek === d && dynamicStyles.dayBtnTextActive]}>{d.substring(0,3)}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity style={dynamicStyles.button} onPress={handleCreate}>
          <Text style={dynamicStyles.buttonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>

      <Text style={dynamicStyles.sectionTitle}>Existing Timetable</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        timetables.map(t => (
          <View key={t.id} style={dynamicStyles.item}>
              <Text style={dynamicStyles.itemText}>{t.dayOfWeek}: {t.startTime} - {t.endTime}</Text>
              <Text style={dynamicStyles.itemSub}>Room {t.room} | Sub ID: {t.subjectId}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  form: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 16, marginBottom: spacing.lg, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 12, color: colors.text, fontSize: 16 },
  label: { fontWeight: '700', marginBottom: 12, color: colors.primary, textTransform: 'uppercase', fontSize: 12 },
  daysRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  dayBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' },
  dayBtnActive: { backgroundColor: colors.primary },
  dayBtnText: { color: colors.primary, fontSize: 11, fontWeight: 'bold' },
  dayBtnTextActive: { color: "#FFFFFF" },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, color: colors.text },
  item: {
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 10,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemText: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  itemSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4 }
});
