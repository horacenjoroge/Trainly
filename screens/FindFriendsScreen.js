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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/api';
// Import the getSafeImageUri function from utils
import { getSafeImageUri } from '../utils/imageUtils';

// API URL
const API_URL = 'http://192.168.100.88:3000/api'; // Adjust to match your api.js

export default function FindFriends({ navigation }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [followingMap, setFollowingMap] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        (user.name && user.name.toLowerCase().includes(query)) || 
        (user.username && user.username.toLowerCase().includes(query)) ||
        (user.bio && user.bio.toLowerCase().includes(query))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Load users and determine follow status
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to load real users from the backend
      try {
        console.log('Fetching real users from API...');
        
        // Use your userService to fetch users
        const realUsers = await userService.searchUsers();
        console.log(`Found ${realUsers.length} real users`);
        
        // If we got real users, use them
        if (realUsers && realUsers.length > 0) {
          setUsers(realUsers);
          setFilteredUsers(realUsers);
          
          // Load following status
          try {
            const followingData = await userService.getFollowing();
            
            // Create a map of userId -> isFollowing
            const followMap = {};
            if (Array.isArray(followingData)) {
              followingData.forEach(user => {
                followMap[user._id] = true;
              });
            }
            
            setFollowingMap(followMap);
          } catch (followError) {
            console.error('Error loading following status:', followError);
          }
          
          setLoading(false);
          return;
        } else {
          console.log('No real users found, using mock data as fallback');
        }
      } catch (apiError) {
        console.error('Error fetching real users:', apiError);
      }
      
      // If we reach this point, there was an issue loading real users
      // Fall back to mock data for development purposes
      console.log('Falling back to mock data');
      
      // Generate MongoDB-compatible ObjectIds for mock users
      const createObjectId = (index) => {
        // Create a MongoDB-like ObjectId (24 hex chars)
        const hex = (index + 100).toString(16).padStart(24, '0');
        return hex;
      };
      
      // Create mock users with MongoDB compatible IDs
      const mockUsers = Array(15).fill().map((_, i) => ({
        _id: createObjectId(i),
        name: `User ${i + 1}`,
        username: `user${i + 1}`,
        bio: i % 3 === 0 ? 'Fitness enthusiast' : i % 3 === 1 ? 'Runner | Gym lover' : 'Yoga practitioner',
        avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i % 10) + 1}.jpg`,
      }));
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      
      // Load following status
      try {
        const followingData = await userService.getFollowing();
        
        // Create a map of userId -> isFollowing
        const followMap = {};
        if (Array.isArray(followingData)) {
          followingData.forEach(user => {
            followMap[user._id] = true;
          });
        }
        
        setFollowingMap(followMap);
      } catch (followError) {
        console.error('Error loading following status:', followError);
      }
      
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
      Alert.alert('Error', 'Failed to load users. Pull down to refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId) => {
    try {
      const isCurrentlyFollowing = followingMap[userId];
      
      if (isCurrentlyFollowing) {
        // Show loading state first (optimistic update)
        setFollowingMap(prev => ({
          ...prev,
          [userId]: false
        }));
        
        await userService.unfollowUser(userId);
        console.log(`Successfully unfollowed user: ${userId}`);
      } else {
        // Show loading state first (optimistic update)
        setFollowingMap(prev => ({
          ...prev,
          [userId]: true
        }));
        
        await userService.followUser(userId);
        console.log(`Successfully followed user: ${userId}`);
      }
      
      // Already updated the UI optimistically, no need to update again on success
      
    } catch (error) {
      console.error('Error toggling follow:', error);
      
      // Revert the optimistic update on error
      const isCurrentlyFollowing = followingMap[userId];
      setFollowingMap(prev => ({
        ...prev,
        [userId]: !isCurrentlyFollowing // Revert to previous state
      }));
      
      Alert.alert('Error', 'Failed to update follow status. Please try again.');
    }
  };

  const handleRefresh = () => {
    loadUsers();
  };

  const renderUserItem = ({ item }) => {
    const isFollowing = followingMap[item._id] || false;
    
    return (
      <View style={[styles.userItem, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => navigation.navigate('UserProfile', { userId: item._id })}
        >
          <Image 
            source={getSafeImageUri(item.avatar)} 
            style={styles.avatar} 
            onError={(e) => {
              console.log('Avatar load error for user:', item.name, e.nativeEvent.error);
            }}
          />
          <View style={styles.nameContainer}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {item.name || item.username || 'User'}
            </Text>
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
            isFollowing 
              ? { borderColor: theme.colors.border, backgroundColor: 'transparent' } 
              : { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => handleFollowToggle(item._id)}
        >
          <Text 
            style={[
              styles.followButtonText, 
              { color: isFollowing ? theme.colors.text : '#fff' }
            ]}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
      
      {error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleRefresh}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredUsers.length === 0 ? (
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
          onRefresh={handleRefresh}
          refreshing={loading}
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
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});