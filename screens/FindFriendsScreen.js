import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/api';

export default function FindFriends({ navigation }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(query) || 
        (user.bio && user.bio.toLowerCase().includes(query))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // This would need a new API endpoint to get users list
      // For now, let's create mock data
      const mockUsers = Array(15).fill().map((_, i) => ({
        _id: `user${i + 1}`,
        name: `User ${i + 1}`,
        bio: i % 3 === 0 ? 'Fitness enthusiast' : i % 3 === 1 ? 'Runner | Gym lover' : 'Yoga practitioner',
        avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 1}.jpg`,
        isFollowing: i % 4 === 0
      }));
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId, isCurrentlyFollowing) => {
    try {
      if (isCurrentlyFollowing) {
        await userService.unfollowUser(userId);
      } else {
        await userService.followUser(userId);
      }
      
      // Update local state
      setUsers(currentUsers => 
        currentUsers.map(user => 
          user._id === userId 
            ? { ...user, isFollowing: !isCurrentlyFollowing } 
            : user
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={[styles.userItem, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity 
        style={styles.userInfo}
        onPress={() => navigation.navigate('UserProfile', { userId: item._id })}
      >
        <Image 
          source={{ uri: global.getSafeImageUri(item.avatar) }} 
          style={styles.avatar} 
        />
        <View style={styles.nameContainer}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{item.name}</Text>
          {item.bio && (
            <Text 
              style={[styles.userBio, { color: theme.colors.textSecondary }]} 
              numberOfLines={1}
            >
              {item.bio}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.followButton, 
          item.isFollowing 
            ? { borderColor: theme.colors.border, backgroundColor: 'transparent' } 
            : { backgroundColor: theme.colors.primary }
        ]}
        onPress={() => handleFollowToggle(item._id, item.isFollowing)}
      >
        <Text 
          style={[
            styles.followButtonText, 
            { color: item.isFollowing ? theme.colors.text : '#fff' }
          ]}
        >
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Find Friends</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Find Friends</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search users..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No users found
          </Text>
          <Text style={[styles.emptySubText, { color: theme.colors.textSecondary }]}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 124, 11, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 124, 11, 0.2)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: 24,
    padding: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 124, 11, 0.2)',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E57C0B',
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userBio: {
    fontSize: 14,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  followButtonText: {
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
  },
});