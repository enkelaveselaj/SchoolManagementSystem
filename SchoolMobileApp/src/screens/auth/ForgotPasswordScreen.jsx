import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../styles';

export default function ForgotPasswordScreen({navigation}){
  const { colors } = useTheme();
  const [email,setEmail]=useState('');
  const { forgotPassword } = useAuth();

  const handleSend=async()=>{
    if (!email) return Alert.alert('Validation', 'Please enter your email');
    try{
      const result = await forgotPassword(email);
      if(result.success){
        Alert.alert('Success', result.message || 'If account exists, a reset link was sent');
        navigation.navigate('Login');
      }
      else { Alert.alert('Error', result.error || 'Unable to send reset link'); }
    }catch(e){console.log(e.message); Alert.alert('Error','An unexpected error occurred');}
  };

  const dynamicStyles = styles(colors);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Forgot Password</Text>
      <Text style={dynamicStyles.subtitle}>Enter your email address and we'll send you a link to reset your password.</Text>

      <TextInput
        style={dynamicStyles.input}
        placeholder="Email Address"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
      />

      <TouchableOpacity style={dynamicStyles.button} onPress={handleSend}>
        <Text style={dynamicStyles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={dynamicStyles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    borderRadius: 12,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 16
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  backButton: {
    marginTop: spacing.xl,
    alignItems: 'center'
  },
  backText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14
  }
});
