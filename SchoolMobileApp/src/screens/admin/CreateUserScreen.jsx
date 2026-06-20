import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { spacing } from '../../styles';
import adminService from '../../services/adminService';
import studentManagementService from '../../services/studentManagementService';
import { useTheme } from '../../hooks/useTheme';

export default function CreateUserScreen({ navigation }) {
  const { colors } = useTheme();
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
      if (role === 'Teacher') {
        // Teacher creation handles both Auth and Teacher record in one backend call
        const teacherRes = await adminService.createTeacher({
          firstName: first_name,
          lastName: last_name,
          email,
          password,
          employeeId: formData.employeeId,
          specialization: formData.specialization,
          phone: 'N/A',
          qualification: 'N/A',
          experience: '0',
          hireDate: new Date().toISOString().split('T')[0],
          emergencyContact: 'N/A',
          emergencyPhone: 'N/A',
        });
        if (!teacherRes.success) throw new Error(teacherRes.error);
      } else {
        // 1. Create Auth User for other roles
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

        // 2. Create Student-specific record if needed
        if (role === 'Student') {
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
      }

      if (Platform.OS === 'web') {
        alert(`${role} created successfully`);
        navigation.goBack();
      } else {
        Alert.alert('Success', `${role} created successfully`, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = styles(colors);

  return (
    <ScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.form}>
        <Text style={dynamicStyles.label}>Role</Text>
        <View style={dynamicStyles.roleContainer}>
          {roles.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                dynamicStyles.roleButton,
                formData.role === r && dynamicStyles.roleButtonActive
              ]}
              onPress={() => setFormData({ ...formData, role: r })}
            >
              <Text style={[
                dynamicStyles.roleButtonText,
                formData.role === r && dynamicStyles.roleButtonTextActive
              ]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={dynamicStyles.label}>First Name</Text>
        <TextInput
          style={dynamicStyles.input}
          value={formData.first_name}
          onChangeText={(text) => setFormData({ ...formData, first_name: text })}
          placeholder="First name"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={dynamicStyles.label}>Last Name</Text>
        <TextInput
          style={dynamicStyles.input}
          value={formData.last_name}
          onChangeText={(text) => setFormData({ ...formData, last_name: text })}
          placeholder="Last name"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={dynamicStyles.label}>Email Address</Text>
        <TextInput
          style={dynamicStyles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
        />

        <Text style={dynamicStyles.label}>Password</Text>
        <TextInput
          style={dynamicStyles.input}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
        />

        {formData.role === 'Teacher' && (
          <>
            <Text style={dynamicStyles.label}>Employee ID</Text>
            <TextInput
              style={dynamicStyles.input}
              value={formData.employeeId}
              onChangeText={(text) => setFormData({ ...formData, employeeId: text })}
              placeholder="EMP123"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={dynamicStyles.label}>Specialization</Text>
            <TextInput
              style={dynamicStyles.input}
              value={formData.specialization}
              onChangeText={(text) => setFormData({ ...formData, specialization: text })}
              placeholder="e.g. Mathematics"
              placeholderTextColor={colors.textSecondary}
            />
          </>
        )}

        {formData.role === 'Student' && (
          <>
            <Text style={dynamicStyles.label}>Birth Date (YYYY-MM-DD)</Text>
            <TextInput
              style={dynamicStyles.input}
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              placeholder="2010-01-01"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={dynamicStyles.label}>Gender</Text>
            <View style={dynamicStyles.roleContainer}>
                {['male', 'female'].map(g => (
                    <TouchableOpacity
                        key={g}
                        style={[dynamicStyles.roleButton, formData.gender === g && dynamicStyles.roleButtonActive]}
                        onPress={() => setFormData({...formData, gender: g})}
                    >
                        <Text style={[dynamicStyles.roleButtonText, formData.gender === g && dynamicStyles.roleButtonTextActive]}>{g}</Text>
                    </TouchableOpacity>
                ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={dynamicStyles.submitButton}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={dynamicStyles.submitButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  form: { padding: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs, marginTop: spacing.md },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, fontSize: 16, color: colors.text },
  roleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  roleButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, borderWidth: 1, borderColor: colors.primary },
  roleButtonActive: { backgroundColor: colors.primary },
  roleButtonText: { color: colors.primary, fontSize: 12, fontWeight: 'bold' },
  roleButtonTextActive: { color: "#fff" },
  submitButton: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: 8, alignItems: 'center', marginTop: spacing.xl },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: 'bold' },
});
