import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import PasswordStrength from '../../components/PasswordStrength';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validators';
import { Alert } from 'react-native';

export default function RegisterScreen({navigation}){
  const [firstName,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [email,setEmail]=useState('');
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const { register } = useAuth();

  const handleRegister=async()=>{
    if(!email || !validateEmail(email)){ Alert.alert('Validation','Please enter a valid email'); return; }
    if(!username || !validateUsername(username)){ Alert.alert('Validation','Please enter a valid username (min 3 chars)'); return; }
    if(!password || !validatePassword(password)){ Alert.alert('Validation','Password must be at least 6 chars, include an uppercase letter and a number'); return; }

    try{
      const result = await register(email, username, password, password);
      if(result.success){ Alert.alert('Success', result.message || 'Registered successfully'); navigation.navigate('Login'); }
      else { Alert.alert('Registration Failed', result.error || 'Unable to register'); }
    }catch(e){ console.log(e.message); Alert.alert('Error','An unexpected error occurred'); }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="First name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize='none' />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize='none' />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <PasswordStrength password={password} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}><Text style={styles.buttonText}>Register</Text></TouchableOpacity>
    </View>
  );
}
const styles=StyleSheet.create({container:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#fff'},title:{fontSize:24,fontWeight:'bold',marginBottom:20},input:{borderWidth:1,borderColor:'#ddd',padding:12,borderRadius:8,marginBottom:12},button:{backgroundColor:'#007AFF',padding:12,borderRadius:8,alignItems:'center'},buttonText:{color:'#fff',fontWeight:'bold'}});

