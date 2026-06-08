import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
export default function ForgotPasswordScreen({navigation}){
  const [email,setEmail]=useState('');
  const { forgotPassword } = useAuth();
  const handleSend=async()=>{
    try{
      const result = await forgotPassword(email);
      if(result.success){ Alert.alert('Success', result.message || 'If account exists, a reset link was sent'); navigation.navigate('Login'); }
      else { Alert.alert('Error', result.error || 'Unable to send reset link'); }
    }catch(e){console.log(e.message); Alert.alert('Error','An unexpected error occurred');}
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize='none' />
      <TouchableOpacity style={styles.button} onPress={handleSend}><Text style={styles.buttonText}>Send Reset Link</Text></TouchableOpacity>
    </View>
  );
}
const styles=StyleSheet.create({container:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#fff'},title:{fontSize:20,fontWeight:'bold',marginBottom:20},input:{borderWidth:1,borderColor:'#ddd',padding:12,borderRadius:8,marginBottom:12},button:{backgroundColor:'#007AFF',padding:12,borderRadius:8,alignItems:'center'},buttonText:{color:'#fff',fontWeight:'bold'}});

