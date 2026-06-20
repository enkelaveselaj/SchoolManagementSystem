import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../styles';
import adminService from '../../services/adminService';
import { useTheme } from '../../hooks/useTheme';

export default function UserManagementScreen({ navigation }) {
  const { colors } = useTheme();
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

  const dynamicStyles = styles(colors);

  const renderUserItem = ({ item }) => (
    <View style={dynamicStyles.userCard}>
      <View style={dynamicStyles.userInfo}>
        <Text style={dynamicStyles.userName}>{item.firstName || item.first_name} {item.lastName || item.last_name} (ID: {item.id})</Text>
        <Text style={dynamicStyles.userEmail}>{item.email}</Text>
        <View style={dynamicStyles.roleTag}>
          <Text style={dynamicStyles.roleText}>{type}</Text>
        </View>
      </View>
      {type === 'Parent' && (
        <View style={dynamicStyles.extraInfo}>
            <Text style={dynamicStyles.subText}>{item.students?.length || 0} Students</Text>
        </View>
      )}
      {type === 'Student' && (
        <View style={dynamicStyles.extraInfo}>
            <Text style={dynamicStyles.subText}>Class: {item.classId || 'N/A'}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>User Management</Text>
        <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity onPress={loadUsers} style={[dynamicStyles.addButton, {backgroundColor: colors.textSecondary}]}>
                <Ionicons name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
            style={dynamicStyles.addButton}
            onPress={() => navigation.navigate('CreateUser')}
            >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={dynamicStyles.addButtonText}>Add</Text>
            </TouchableOpacity>
        </View>
      </View>

      <View style={dynamicStyles.tabContainer}>
        {['Student', 'Teacher', 'Parent'].map(t => (
            <TouchableOpacity
                key={t}
                style={[dynamicStyles.tab, type === t && dynamicStyles.tabActive]}
                onPress={() => setType(t)}
            >
                <Text style={[dynamicStyles.tabText, type === t && dynamicStyles.tabTextActive]}>{t}s</Text>
            </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={dynamicStyles.loader} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          contentContainerStyle={dynamicStyles.listContent}
          ListEmptyComponent={
            <Text style={dynamicStyles.emptyText}>No {type}s found.</Text>
          }
          refreshing={loading}
          onRefresh={loadUsers}
        />
      )}
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, backgroundColor: colors.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  addButton: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 8 },
  addButtonText: { color: "#fff", fontWeight: 'bold', marginLeft: 4 },
  tabContainer: { flexDirection: 'row', backgroundColor: colors.card, paddingBottom: 10 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.primary },
  listContent: { padding: spacing.md },
  userCard: { backgroundColor: colors.card, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  userEmail: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  roleTag: { backgroundColor: colors.primary + '20', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 6 },
  roleText: { fontSize: 10, color: colors.primary, fontWeight: 'bold' },
  extraInfo: { marginLeft: 10 },
  subText: { fontSize: 12, color: colors.textSecondary },
  loader: { marginTop: 40 },
  emptyText: { textAlign: 'center', marginTop: 40, color: colors.textSecondary },
});
