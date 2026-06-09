import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import schoolService from '../../services/schoolService';

export default function AdminSectionManagementScreen() {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [formData, setFormData] = useState({ classId: '', name: '', capacity: '30', roomNumber: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [clsRes, secRes] = await Promise.all([
      schoolService.getClasses(),
      schoolService.getSections()
    ]);
    if (clsRes.success) setClasses(clsRes.data);
    if (secRes.success) setSections(secRes.data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.classId || !formData.name) return Alert.alert('Error', 'Class and Section Name are required');
    const res = await schoolService.createSection({
      ...formData,
      classId: parseInt(formData.classId),
      capacity: parseInt(formData.capacity)
    });
    if (res.success) {
      Alert.alert('Success', 'Section created');
      setFormData({ classId: '', name: '', capacity: '30', roomNumber: '' });
      loadData();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const getClassName = (id) => classes.find(c => c.id === id)?.name || 'Unknown';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Section Management</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Class ID</Text>
        <TextInput style={styles.input} placeholder="Class ID" value={formData.classId} onChangeText={t => setFormData({...formData, classId: t})} keyboardType="numeric" />

        <Text style={styles.label}>Section Name</Text>
        <TextInput style={styles.input} placeholder="e.g. Section A" value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />

        <Text style={styles.label}>Capacity</Text>
        <TextInput style={styles.input} placeholder="30" value={formData.capacity} onChangeText={t => setFormData({...formData, capacity: t})} keyboardType="numeric" />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Add Section</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        <Text style={styles.sectionTitle}>Existing Sections</Text>
        {sections.map(s => (
          <View key={s.id} style={styles.item}>
            <Text style={styles.itemText}>{getClassName(s.classId)} - {s.name} (ID: {s.id})</Text>
            <Text style={styles.itemSub}>Capacity: {s.capacity} | Room: {s.roomNumber || 'N/A'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg },
  section: { backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md },
  list: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16, fontWeight: 'bold' },
  itemSub: { fontSize: 12, color: colors.gray500, marginTop: 2 }
});
