import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';
import adminService from '../../services/adminService';

export default function UserManagementScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [type, setType] = useState('Student'); // Student, Teacher, Parent
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [type]);

  const loadUsers = async () => {
    setLoading(true);
    let result;
    if (type === 'Student') result = await adminService.getStudents();
    else if (type === 'Teacher') result = await adminService.getTeachers();
    else result = await adminService.getParents();

    if (result.success) {
      setData(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
    setLoading(false);
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.firstName || item.first_name} {item.lastName || item.last_name} (ID: {item.id})</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.roleTag}>
          <Text style={styles.roleText}>{type}</Text>
        </View>
      </View>
      {type === 'Parent' && (
        <View style={styles.extraInfo}>
            <Text style={styles.subText}>{item.students?.length || 0} Students</Text>
        </View>
      )}
      {type === 'Student' && (
        <View style={styles.extraInfo}>
            <Text style={styles.subText}>Class: {item.classId || 'N/A'}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity onPress={loadUsers} style={[styles.addButton, {backgroundColor: '#666'}]}>
                <Ionicons name="refresh" size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateUser')}
            >
            <Ionicons name="add" size={24} color={colors.white} />
            <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {['Student', 'Teacher', 'Parent'].map(t => (
            <TouchableOpacity
                key={t}
                style={[styles.tab, type === t && styles.tabActive]}
                onPress={() => setType(t)}
            >
                <Text style={[styles.tabText, type === t && styles.tabTextActive]}>{t}s</Text>
            </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No {type}s found.</Text>
          }
          refreshing={loading}
          onRefresh={loadUsers}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  header: { padding: spacing.lg, backgroundColor: colors.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold' },
  addButton: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 8 },
  addButtonText: { color: colors.white, fontWeight: 'bold', marginLeft: 4 },
  tabContainer: { flexDirection: 'row', backgroundColor: colors.white, paddingBottom: 10 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontWeight: '600', color: colors.gray500 },
  tabTextActive: { color: colors.primary },
  listContent: { padding: spacing.md },
  userCard: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  userEmail: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  roleTag: { backgroundColor: '#E3F2FD', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 6 },
  roleText: { fontSize: 10, color: '#1976D2', fontWeight: 'bold' },
  extraInfo: { marginLeft: 10 },
  subText: { fontSize: 12, color: colors.gray500 },
  loader: { marginTop: 40 },
  emptyText: { textAlign: 'center', marginTop: 40, color: colors.gray500 },
});
