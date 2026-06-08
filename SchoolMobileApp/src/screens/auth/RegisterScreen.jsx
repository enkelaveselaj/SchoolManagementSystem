import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../../services/api';
export default function RegisterScreen({navigation}){
  const [firstName,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const handleRegister=async()=>{
    try{await api.post('/auth/register',{first_name:firstName,last_name:lastName,email,password});navigation.navigate('Login');}catch(e){console.log(e.message);}
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="First name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize='none' />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister}><Text style={styles.buttonText}>Register</Text></TouchableOpacity>
    </View>
  );
}
const styles=StyleSheet.create({container:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#fff'},title:{fontSize:24,fontWeight:'bold',marginBottom:20},input:{borderWidth:1,borderColor:'#ddd',padding:12,borderRadius:8,marginBottom:12},button:{backgroundColor:'#007AFF',padding:12,borderRadius:8,alignItems:'center'},buttonText:{color:'#fff',fontWeight:'bold'}});

