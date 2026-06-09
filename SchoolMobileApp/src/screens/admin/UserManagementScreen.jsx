import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';
import adminService from '../../services/adminService';

export default function UserManagementScreen({ navigation }) {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    setLoading(true);
    const result = await adminService.getParents();
    if (result.success) {
      setParents(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
    setLoading(false);
  };

  const renderParentItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.roleTag}>
          <Text style={styles.roleText}>Parent</Text>
        </View>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentCount}>
          {item.students?.length || 0} Students linked
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {}} // navigation.navigate('EditUser', { userId: item.id })
      >
        <Ionicons name="create-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateUser')}
        >
          <Ionicons name="add" size={24} color={colors.white} />
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={parents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderParentItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found.</Text>
          }
          refreshing={loading}
          onRefresh={loadParents}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  listContent: {
    padding: spacing.md,
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  roleTag: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  roleText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  studentInfo: {
    marginRight: spacing.md,
  },
  studentCount: {
    fontSize: 12,
    color: colors.gray500,
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.gray500,
  },
});
