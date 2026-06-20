import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { spacing } from '../../styles';
import schoolService from '../../services/schoolService';
import { useTheme } from '../../hooks/useTheme';

export default function AdminClassManagementScreen() {
  const { colors } = useTheme();
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    gradeLevel: '',
    section: '',
    academicYearId: ''
  });

  useEffect(() => {
    loadClasses();
    loadAcademicYears();
  }, []);

  const loadClasses = async () => {
    const res = await schoolService.getClasses();
    if (res.success) setClasses(res.data);
  };

  const loadAcademicYears = async () => {
    const res = await schoolService.getAcademicYears();
    if (res.success) {
      setAcademicYears(res.data);
      // Set default academic year if available
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, academicYearId: res.data[0].id.toString() }));
      }
    }
  };

  const handleCreateClass = async () => {
    const { name, gradeLevel, section, academicYearId } = formData;

    if (!name || !gradeLevel || !section || !academicYearId) {
      return Alert.alert('Error', 'All fields are required');
    }

    const res = await schoolService.createClass({
      name,
      gradeLevel: parseInt(gradeLevel),
      section,
      academicYearId: parseInt(academicYearId)
    });

    if (res.success) {
      Alert.alert('Success', 'Class created');
      setFormData({
        name: '',
        gradeLevel: '',
        section: '',
        academicYearId: academicYears.length > 0 ? academicYears[0].id.toString() : ''
      });
      loadClasses();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const dynamicStyles = styles(colors);

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
      <Text style={dynamicStyles.title}>Class Management</Text>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.label}>Class Name</Text>
        <TextInput
          style={dynamicStyles.input}
          placeholder="e.g. Grade 10-A"
          placeholderTextColor={colors.textSecondary}
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
        />

        <Text style={dynamicStyles.label}>Grade Level (1-12)</Text>
        <TextInput
          style={dynamicStyles.input}
          placeholder="e.g. 10"
          placeholderTextColor={colors.textSecondary}
          value={formData.gradeLevel}
          keyboardType="numeric"
          onChangeText={(text) => setFormData({...formData, gradeLevel: text})}
        />

        <Text style={dynamicStyles.label}>Section</Text>
        <TextInput
          style={dynamicStyles.input}
          placeholder="e.g. A"
          placeholderTextColor={colors.textSecondary}
          value={formData.section}
          onChangeText={(text) => setFormData({...formData, section: text})}
        />

        <Text style={dynamicStyles.label}>Academic Year ID</Text>
        <TextInput
          style={dynamicStyles.input}
          placeholder="Year ID"
          placeholderTextColor={colors.textSecondary}
          value={formData.academicYearId}
          keyboardType="numeric"
          onChangeText={(text) => setFormData({...formData, academicYearId: text})}
        />

        {academicYears.length > 0 && (
          <View style={dynamicStyles.infoBox}>
            <Text style={dynamicStyles.infoText}>Available Years:</Text>
            {academicYears.map(y => (
              <Text key={y.id} style={dynamicStyles.infoText}>• {y.name} (ID: {y.id})</Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={dynamicStyles.button} onPress={handleCreateClass}>
          <Text style={dynamicStyles.buttonText}>Add Class</Text>
        </TouchableOpacity>
      </View>

      <Text style={dynamicStyles.subtitle}>Existing Classes</Text>
      <View style={dynamicStyles.list}>
        {classes.length === 0 ? (
          <Text style={dynamicStyles.emptyText}>No classes found</Text>
        ) : (
          classes.map(c => (
            <View key={c.id} style={dynamicStyles.item}>
              <Text style={dynamicStyles.itemText}>{c.name}</Text>
              <Text style={dynamicStyles.itemSubtext}>Grade: {c.gradeLevel} | Section: {c.section}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.text },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: spacing.lg, marginBottom: spacing.md, color: colors.text },
  section: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: colors.textSecondary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, marginBottom: 12, color: colors.text },
  infoBox: { backgroundColor: colors.background, padding: 10, borderRadius: 8, marginBottom: 12 },
  infoText: { fontSize: 12, color: colors.textSecondary },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  list: { backgroundColor: colors.card, borderRadius: 12, padding: spacing.md },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemText: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  itemSubtext: { fontSize: 14, color: colors.textSecondary },
  emptyText: { textAlign: 'center', color: colors.textSecondary, padding: 20 }
});
