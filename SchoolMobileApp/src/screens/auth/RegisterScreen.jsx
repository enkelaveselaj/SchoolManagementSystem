import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import PasswordStrength from '../../components/PasswordStrength';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validators';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../styles';

export default function RegisterScreen({navigation}){
  const { colors } = useTheme();
  const [firstName,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const { register } = useAuth();

  const handleRegister=async()=>{
    if(!firstName){ Alert.alert('Validation','First name is required'); return; }
    if(!lastName){ Alert.alert('Validation','Last name is required'); return; }
    if(!email || !validateEmail(email)){ Alert.alert('Validation','Please enter a valid email'); return; }
    if(!password || !validatePassword(password)){ Alert.alert('Validation','Password must be at least 6 chars, include an uppercase letter and a number'); return; }

    try{
      const result = await register(email, firstName, lastName, password, password);
      if(result.success){ Alert.alert('Success', result.message || 'Registered successfully'); navigation.navigate('Login'); }
      else { Alert.alert('Registration Failed', result.error || 'Unable to register'); }
    }catch(e){ console.log(e.message); Alert.alert('Error','An unexpected error occurred'); }
  };

  const dynamicStyles = styles(colors);

  return (
    <ScrollView contentContainerStyle={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Create Account</Text>

      <View style={dynamicStyles.inputContainer}>
        <TextInput
          style={dynamicStyles.input}
          placeholder="First name"
          placeholderTextColor={colors.textSecondary}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Last name"
          placeholderTextColor={colors.textSecondary}
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <PasswordStrength password={password} />

      <TouchableOpacity style={dynamicStyles.button} onPress={handleRegister}>
        <Text style={dynamicStyles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.footer}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={dynamicStyles.footerText}>Already have an account? <Text style={dynamicStyles.link}>Login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
    color: colors.text,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: spacing.md
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    borderRadius: 12,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 16
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: 'bold',
    fontSize: 16
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center'
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14
  },
  link: {
    color: colors.primary,
    fontWeight: 'bold'
  }
});
