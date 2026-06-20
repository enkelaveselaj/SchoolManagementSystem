import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { spacing } from '../../styles';
import schoolService from '../../services/schoolService';
import { useTheme } from '../../hooks/useTheme';

export default function AdminSectionManagementScreen() {
  const { colors } = useTheme();
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
      setFormData({ classId: classes.length > 0 ? classes[0].id.toString() : '', name: '', capacity: '30', roomNumber: '' });
      loadData();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const getClassName = (id) => classes.find(c => c.id === id)?.name || `Class ID: ${id}`;

  const dynamicStyles = styles(colors);

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
      <Text style={dynamicStyles.title}>Section Management</Text>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.label}>Class ID</Text>
        <TextInput
          style={dynamicStyles.input}
          placeholder="Enter a valid Class ID"
          placeholderTextColor={colors.textSecondary}
          value={formData.classId}
          onChangeText={t => setFormData({...formData, classId: t})}
          keyboardType="numeric"
        />

        {classes.length > 0 && (
          <View style={dynamicStyles.infoBox}>
            <Text style={dynamicStyles.infoText}>Available Classes (IDs):</Text>
            {classes.map(c => (
              <Text key={c.id} style={dynamicStyles.infoText}>• {c.name} (ID: {c.id})</Text>
            ))}
          </View>
        )}

        <Text style={dynamicStyles.label}>Section Name</Text>
        <TextInput style={dynamicStyles.input} placeholder="e.g. Section A" placeholderTextColor={colors.textSecondary} value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />

        <Text style={dynamicStyles.label}>Capacity</Text>
        <TextInput style={dynamicStyles.input} placeholder="30" placeholderTextColor={colors.textSecondary} value={formData.capacity} onChangeText={t => setFormData({...formData, capacity: t})} keyboardType="numeric" />

        <TouchableOpacity style={dynamicStyles.button} onPress={handleCreate}>
          <Text style={dynamicStyles.buttonText}>Add Section</Text>
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.list}>
        <Text style={dynamicStyles.sectionTitle}>Existing Sections</Text>
        {sections.map(s => (
          <View key={s.id} style={dynamicStyles.item}>
            <Text style={dynamicStyles.itemText}>{getClassName(s.classId)} - {s.name} (ID: {s.id})</Text>
            <Text style={dynamicStyles.itemSub}>Capacity: {s.capacity} | Room: {s.roomNumber || 'N/A'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  section: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 4, color: colors.textSecondary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, marginBottom: 12, color: colors.text },
  infoBox: { backgroundColor: colors.background, padding: 10, borderRadius: 8, marginBottom: 12 },
  infoText: { fontSize: 12, color: colors.textSecondary },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, color: colors.text },
  list: { backgroundColor: colors.card, borderRadius: 12, padding: spacing.md },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemText: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  itemSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 }
});
