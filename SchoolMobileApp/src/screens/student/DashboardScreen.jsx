import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';
export default function DashboardScreen(){
  const user = useAuthStore(state=>state.user);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome{user?.first_name ? `, ${user.first_name}` : ''}</Text>
      <View style={styles.card}><Text style={styles.cardTitle}>Attendance</Text><Text style={styles.cardValue}>92.5%</Text></View>
      <View style={styles.card}><Text style={styles.cardTitle}>Average Grade</Text><Text style={styles.cardValue}>8.2</Text></View>
      <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>View Grades</Text></TouchableOpacity>
    </ScrollView>
  );
}
const styles=StyleSheet.create({container:{padding:20,backgroundColor:'#fff'},title:{fontSize:22,fontWeight:'bold',marginBottom:16},card:{backgroundColor:'#F3F4F6',padding:16,borderRadius:8,marginBottom:12},cardTitle:{fontSize:14,color:'#6B7280'},cardValue:{fontSize:18,fontWeight:'bold'},button:{backgroundColor:'#007AFF',padding:12,borderRadius:8,alignItems:'center'},buttonText:{color:'#fff',fontWeight:'bold'}});

