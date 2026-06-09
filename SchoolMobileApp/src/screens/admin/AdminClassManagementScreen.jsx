import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing } from '../../styles';
import schoolService from '../../services/schoolService';

export default function AdminClassManagementScreen() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const res = await schoolService.getClasses();
    if (res.success) setClasses(res.data);
  };

  const handleCreateClass = async () => {
    if (!className) return Alert.alert('Error', 'Class name is required');
    const res = await schoolService.createClass({ name: className });
    if (res.success) {
      Alert.alert('Success', 'Class created');
      setClassName('');
      loadClasses();
    } else {
      Alert.alert('Error', res.error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Class Management</Text>
      <View style={styles.section}>
        <TextInput style={styles.input} placeholder="Class Name (e.g. Grade 10)" value={className} onChangeText={setClassName} />
        <TouchableOpacity style={styles.button} onPress={handleCreateClass}>
          <Text style={styles.buttonText}>Add Class</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {classes.map(c => (
          <View key={c.id} style={styles.item}><Text style={styles.itemText}>{c.name} (ID: {c.id})</Text></View>
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
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8 },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
  list: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16 }
});
