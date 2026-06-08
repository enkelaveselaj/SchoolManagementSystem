import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';
export default function LoginScreen({navigation}){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const { login } = useAuth();
  const handleLogin=async()=>{
    if(!email){ Alert.alert('Validation','Email is required'); return; }
    if(!validateEmail(email)){ Alert.alert('Validation','Please enter a valid email'); return; }
    if(!password){ Alert.alert('Validation','Password is required'); return; }

    setLoading(true);
    try{
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Unable to sign in');
      }
    }catch(e){
      console.log(e.message);
      Alert.alert('Error', 'An unexpected error occurred');
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

