import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.100.88:3000/api'; // Same as in your api.js

export default function UserProfile({ route, navigation }) {
  // Add a safety check for route.params
  const { userId } = route?.params || {};
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    bio: '',
    avatar: 'https://via.placeholder.com/150',
    stats: {
      workouts: 0,
      hours: 0,
      calories: 0
    },
    followers: 0,
    following: 0
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);
  
  // Sample MongoDB ObjectId format users for testing
  const mockUsers = {
    // MongoDB-compatible ObjectIds (24-char hex strings)
    '507f1f77bcf86cd799439011': {
      _id: '507f1f77bcf86cd799439011',
      name: 'John Doe',
      bio: 'Fitness enthusiast and trail runner',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      stats: {
        workouts: 45,
        hours: 78,
        calories: 12500
      },
      followers: 24,
      following: 36
    },
    '507f1f77bcf86cd799439012': {
      _id: '507f1f77bcf86cd799439012',
      name: 'Jane Smith',
      bio: 'Yoga instructor and meditation practitioner',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      stats: {
        workouts: 67,
        hours: 112,
        calories: 8900
      },
      followers: 152,
      following: 89
    },
    '507f1f77bcf86cd799439013': {
      _id: '507f1f77bcf86cd799439013',
      name: 'Mike Johnson',
      bio: 'Weightlifting champion, personal trainer',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      stats: {
        workouts: 124,
        hours: 230,
        calories: 28600
      },
      followers: 87,
      following: 53
    }
  };

  // Helper to create a mock user if none exists
  const createMockUser = (id) => {
    // Create a deterministic number from the userId string
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const userNumber = hash % 10;
    
    return {
      _id: id,
      name: `User ${userNumber}`,
      bio: userNumber % 2 === 0 ? 'Fitness enthusiast' : 'Health and wellness advocate',
      avatar: `https://randomuser.me/api/portraits/${userNumber % 2 === 0 ? 'men' : 'women'}/${userNumber + 1}.jpg`,
      stats: {
        workouts: Math.floor(20 + (hash % 80)),
        hours: Math.floor(40 + (hash % 100)),
        calories: Math.floor(5000 + (hash % 25000))
      },
      followers: Math.floor(10 + (hash % 100)),
      following: Math.floor(10 + (hash % 50))
    };
  };

  useEffect(() => {
    if (userId) {
      loadCurrentUser();
      loadUserProfile();
    } else {
      setLoading(false);
      setError('No user ID provided');
    }
  }, [userId]);

  const loadCurrentUser = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const user = JSON.parse(data);
        setCurrentUserId(user._id);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // First check if we have this user in our mock data
      if (mockUsers[userId]) {
        console.log('Using mock user from predefined list');
        setUserData(mockUsers[userId]);
        
        // Check if current user is following this user
        try {
          const followingData = await userService.getFollowing();
          const isFollowingUser = Array.isArray(followingData) && 
            followingData.some(user => user._id === userId);
          setIsFollowing(isFollowingUser);
        } catch (followError) {
          console.error('Error checking following status:', followError);
          setIsFollowing(false);
        }
        
        setLoading(false);
        return;
      }
      
      // Try to get user profile from API
      try {
        console.log(`Fetching user profile for: ${userId}`);
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user with status: ${response.status}`);
        }
        const profileData = await response.json();
        
        // Make sure stats object exists
        profileData.stats = profileData.stats || {
          workouts: 0,
          hours: 0,
          calories: 0
        };
        
        setUserData(profileData);
      } catch (apiError) {
        console.error('Error from API:', apiError);
        
        // Fallback to userService if fetch fails
        try {
          console.log('Trying userService as fallback');
          const profileData = await userService.getUserById(userId);
          
          // Ensure stats object exists
          profileData.stats = profileData.stats || {
            workouts: 0,
            hours: 0,
            calories: 0
          };
          
          setUserData(profileData);
        } catch (serviceError) {
          console.error('Error from user service:', serviceError);
          
          // Generate a mock user as last resort
          console.log('Generating mock user as last resort');
          const mockUser = createMockUser(userId);
          setUserData(mockUser);
        }
      }
      
      // Check if current user is following this user
      try {
        const followingData = await userService.getFollowing();
        const isFollowingUser = Array.isArray(followingData) && 
          followingData.some(user => user._id === userId);
        setIsFollowing(isFollowingUser);
      } catch (followError) {
        console.error('Error checking following status:', followError);
        setIsFollowing(false);
      }
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      // Update UI immediately for better user experience
      if (isFollowing) {
        setIsFollowing(false);
        // Decrease followers count locally for immediate UI feedback
        setUserData(prev => ({
          ...prev,
          followers: Math.max(0, (prev.followers || 0) - 1)
        }));
        
        // Then make the API call
        await userService.unfollowUser(userId);
        console.log(`Successfully unfollowed user: ${userId}`);
      } else {
        setIsFollowing(true);
        // Increase followers count locally for immediate UI feedback
        setUserData(prev => ({
          ...prev,
          followers: (prev.followers || 0) + 1
        }));
        
        // Then make the API call
        await userService.followUser(userId);
        console.log(`Successfully followed user: ${userId}`);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      
      // Revert the UI changes if the API call failed
      setIsFollowing(!isFollowing);
      setUserData(prev => ({
        ...prev,
        followers: isFollowing 
          ? (prev.followers || 0) + 1  // If was unfollowing, add the follower back
          : Math.max(0, (prev.followers || 0) - 1)  // If was following, remove the follower
      }));
      
      Alert.alert('Error', 'Could not perform this action. Please try again later.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !userId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {error || 'User not found'}
          </Text>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView>
        <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface }]}>
          <Image
            source={{ uri: global.getSafeImageUri(userData.avatar) }}
            style={styles.profileImage}
            onError={(e) => {
              console.log('Image error:', e.nativeEvent.error);
              // Fallback to placeholder on error
              setUserData(prev => ({
                ...prev,
                avatar: 'https://via.placeholder.com/150'
              }));
            }}
          />
          
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {userData.name || 'User'}
          </Text>
          <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
            {userData.bio || 'Fitness enthusiast'}
          </Text>
          
          {currentUserId !== userId && (
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing 
                  ? { borderColor: theme.colors.border, backgroundColor: 'transparent' }
                  : { backgroundColor: theme.colors.primary }
              ]}
              onPress={handleFollowToggle}
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
          )}
        </View>

        <View style={[styles.statsRow, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.stats?.workouts || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Workouts</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.stat, styles.statBorder, { borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('UserFollowers', { userId: userId })}
          >
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.followers || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Followers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.stat, styles.statBorder, { borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('UserFollowing', { userId: userId })}
          >
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.following || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Following</Text>
          </TouchableOpacity>
          
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.stats?.calories || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Calories</Text>
          </View>
        </View>

        {/* You can add more sections like recent workouts, achievements, etc. */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Activity</Text>
          <View style={styles.emptySection}>
            <Text style={{ color: theme.colors.textSecondary }}>No recent activity</Text>
          </View>
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 124, 11, 0.2)',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#E57C0B',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  bio: {
    fontSize: 16,
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  followButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 1,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 124, 11, 0.2)',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  section: {
    padding: 16,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 124, 11, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  emptySection: {
    padding: 20,
    alignItems: 'center',
  },
});