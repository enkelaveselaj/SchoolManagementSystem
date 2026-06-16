import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';

export default function TeacherTimetableScreen() {
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
    // In a real app we'd filter by teacher
    const res = await academicService.getTimetables();
    if (res.success) setTimetables(res.data);
  };

  useEffect(() => {
    loadTimetables();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Manage Timetable</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Subject ID" value={formData.subjectId} onChangeText={t => setFormData({...formData, subjectId: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Class ID" value={formData.classId} onChangeText={t => setFormData({...formData, classId: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Section ID" value={formData.sectionId} onChangeText={t => setFormData({...formData, sectionId: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Teacher ID" value={formData.teacherId} onChangeText={t => setFormData({...formData, teacherId: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Room" value={formData.room} onChangeText={t => setFormData({...formData, room: t})} />
        <TextInput style={styles.input} placeholder="Start Time (HH:MM)" value={formData.startTime} onChangeText={t => setFormData({...formData, startTime: t})} />
        <TextInput style={styles.input} placeholder="End Time (HH:MM)" value={formData.endTime} onChangeText={t => setFormData({...formData, endTime: t})} />

        <Text style={styles.label}>Day</Text>
        <View style={styles.daysRow}>
            {days.slice(0, 5).map(d => (
                <TouchableOpacity
                    key={d}
                    style={[styles.dayBtn, formData.dayOfWeek === d && styles.dayBtnActive]}
                    onPress={() => setFormData({...formData, dayOfWeek: d})}
                >
                    <Text style={[styles.dayBtnText, formData.dayOfWeek === d && styles.dayBtnTextActive]}>{d.substring(0,3)}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Existing Timetable</Text>
      {timetables.map(t => (
        <View key={t.id} style={styles.item}>
            <Text style={styles.itemText}>{t.dayOfWeek}: {t.startTime} - {t.endTime}</Text>
            <Text style={styles.itemSub}>Room {t.room} | Sub ID: {t.subjectId}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  form: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  daysRow: { flexDirection: 'row', gap: 5, marginBottom: 12 },
  dayBtn: { flex: 1, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' },
  dayBtnActive: { backgroundColor: colors.primary },
  dayBtnText: { color: colors.primary, fontSize: 10, fontWeight: 'bold' },
  dayBtnTextActive: { color: colors.white },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md },
  item: { backgroundColor: colors.white, padding: 12, marginBottom: 8, borderRadius: 8 },
  itemText: { fontSize: 16, fontWeight: 'bold' },
  itemSub: { fontSize: 12, color: colors.gray500, marginTop: 4 }
});
