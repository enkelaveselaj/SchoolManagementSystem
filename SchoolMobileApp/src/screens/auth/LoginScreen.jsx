import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { STORAGE_KEYS } from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function LoginScreen({navigation}){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const setUser = useAuthStore(state=>state.setUser);
  const setToken = useAuthStore(state=>state.setToken);
  const handleLogin=async()=>{
    setLoading(true);
    try{
      const res=await api.post('/auth/login',{email,password});
      const { token,user } = res.data;
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN,token);
      setUser(user);
      setToken(token);
    }catch(e){
      console.log(e.message);
    }finally{setLoading(false);}
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize='none' />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
      <View style={styles.links}>
        <TouchableOpacity onPress={()=>navigation.navigate('Register')}><Text style={styles.linkText}>Register</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')}><Text style={styles.linkText}>Forgot Password</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const styles=StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#fff'},
  title:{fontSize:24,fontWeight:'bold',marginBottom:20},
  input:{borderWidth:1,borderColor:'#ddd',padding:12,borderRadius:8,marginBottom:12},
  button:{backgroundColor:'#007AFF',padding:12,borderRadius:8,alignItems:'center'},
  buttonText:{color:'#fff',fontWeight:'bold'},
  links:{flexDirection:'row',justifyContent:'space-between',marginTop:12},
  linkText:{color:'#007AFF'}
});

