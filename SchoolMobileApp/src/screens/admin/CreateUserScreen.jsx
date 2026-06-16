import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../styles';
import adminService from '../../services/adminService';
import studentManagementService from '../../services/studentManagementService';

export default function CreateUserScreen({ navigation }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'Student',
    // Teacher specific
    employeeId: '',
    specialization: '',
    // Student specific
    dateOfBirth: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(false);

  const roles = ['Student', 'Teacher', 'Parent', 'Admin'];

  const handleCreate = async () => {
    const { first_name, last_name, email, password, role } = formData;

    if (!first_name || !last_name || !email || !password) {
      Alert.alert('Error', 'Required basic fields are missing');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const authRes = await adminService.createUser({
        first_name,
        last_name,
        email,
        password,
        role
      });

      if (!authRes.success) {
        throw new Error(authRes.error);
      }

      const userId = authRes.data.id;

      // 2. Create Role-specific Record
      if (role === 'Teacher') {
        const teacherRes = await adminService.createTeacher({
          firstName: first_name,
          lastName: last_name,
          email,
          password, // Usually teacher service handles its own hash but here we use auth userId
          employeeId: formData.employeeId,
          specialization: formData.specialization,
          userId
        });
        if (!teacherRes.success) throw new Error(teacherRes.error);
      } else if (role === 'Student') {
        const studentRes = await studentManagementService.createStudent({
          firstName: first_name,
          lastName: last_name,
          email,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          userId
        });
        if (!studentRes.success) throw new Error(studentRes.error);
      }

      Alert.alert('Success', `${role} created successfully`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Role</Text>
        <View style={styles.roleContainer}>
          {roles.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleButton,
                formData.role === r && styles.roleButtonActive
              ]}
              onPress={() => setFormData({ ...formData, role: r })}
            >
              <Text style={[
                styles.roleButtonText,
                formData.role === r && styles.roleButtonTextActive
              ]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={formData.first_name}
          onChangeText={(text) => setFormData({ ...formData, first_name: text })}
          placeholder="First name"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={formData.last_name}
          onChangeText={(text) => setFormData({ ...formData, last_name: text })}
          placeholder="Last name"
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Email"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="Password"
          secureTextEntry
        />

        {formData.role === 'Teacher' && (
          <>
            <Text style={styles.label}>Employee ID</Text>
            <TextInput
              style={styles.input}
              value={formData.employeeId}
              onChangeText={(text) => setFormData({ ...formData, employeeId: text })}
              placeholder="EMP123"
            />
            <Text style={styles.label}>Specialization</Text>
            <TextInput
              style={styles.input}
              value={formData.specialization}
              onChangeText={(text) => setFormData({ ...formData, specialization: text })}
              placeholder="e.g. Mathematics"
            />
          </>
        )}

        {formData.role === 'Student' && (
          <>
            <Text style={styles.label}>Birth Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              placeholder="2010-01-01"
            />
            <Text style={styles.label}>Gender</Text>
            <View style={styles.roleContainer}>
                {['male', 'female'].map(g => (
                    <TouchableOpacity
                        key={g}
                        style={[styles.roleButton, formData.gender === g && styles.roleButtonActive]}
                        onPress={() => setFormData({...formData, gender: g})}
                    >
                        <Text style={[styles.roleButtonText, formData.gender === g && styles.roleButtonTextActive]}>{g}</Text>
                    </TouchableOpacity>
                ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  form: { padding: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.black, marginBottom: spacing.xs, marginTop: spacing.md },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: spacing.md, fontSize: 16 },
  roleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  roleButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, borderWidth: 1, borderColor: colors.primary },
  roleButtonActive: { backgroundColor: colors.primary },
  roleButtonText: { color: colors.primary, fontSize: 12, fontWeight: 'bold' },
  roleButtonTextActive: { color: colors.white },
  submitButton: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: 8, alignItems: 'center', marginTop: spacing.xl },
  submitButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});
