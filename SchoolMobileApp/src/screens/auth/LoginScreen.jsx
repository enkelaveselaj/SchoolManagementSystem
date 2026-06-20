import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';
import { useTheme } from '../../hooks/useTheme';

export default function LoginScreen({navigation}){
  const { colors } = useTheme();
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

  const dynamicStyles = styles(colors);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Sign In</Text>
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
      <TouchableOpacity style={dynamicStyles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={dynamicStyles.buttonText}>Login</Text>}
      </TouchableOpacity>
      <View style={dynamicStyles.links}>
        <TouchableOpacity onPress={()=>navigation.navigate('Register')}><Text style={dynamicStyles.linkText}>Register</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')}><Text style={dynamicStyles.linkText}>Forgot Password</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20,backgroundColor:colors.background},
  title:{fontSize:24,fontWeight:'bold',marginBottom:20, color: colors.text},
  input:{borderWidth:1,borderColor:colors.border,padding:12,borderRadius:8,marginBottom:12, color: colors.text},
  button:{backgroundColor:colors.primary,padding:12,borderRadius:8,alignItems:'center'},
  buttonText:{color:'#fff',fontWeight:'bold'},
  links:{flexDirection:'row',justifyContent:'space-between',marginTop:12},
  linkText:{color:colors.primary}
});

