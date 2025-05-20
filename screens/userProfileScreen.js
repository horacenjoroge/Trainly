// userProfileScreen.js - clean version using only real data
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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { userService, postService } from '../services/api';
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
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadCurrentUser();
      loadUserProfile();
      fetchUserPosts();
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
          setError('Failed to load user profile');
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

  // Fetch posts made by this user
  const fetchUserPosts = async () => {
    try {
      // Try to fetch user posts from API
      try {
        // For simplicity, we'll just filter the general posts by user ID
        // In a real app, you'd have a dedicated endpoint for this
        const allPosts = await postService.getPosts();
        
        // Filter posts where the user is the author
        if (allPosts && allPosts.length > 0) {
          const filteredPosts = allPosts.filter(post => {
            if (!post.user) return false;
            
            if (typeof post.user === 'string') {
              return post.user === userId;
            }
            
            if (post.user._id) {
              return post.user._id === userId;
            }
            
            if (post.user.id) {
              return post.user.id === userId;
            }
            
            return false;
          });
          
          // Set the filtered posts - if there are none, the array will be empty
          setUserPosts(filteredPosts);
          console.log(`Found ${filteredPosts.length} posts for user ${userId}`);
          return;
        }
        
        // If we get here, there were no posts in the system
        setUserPosts([]);
        console.log('No posts found for any user in the system');
      } catch (error) {
        console.error('Error fetching user posts from API:', error);
        setUserPosts([]);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
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

  // Post item component for Recent Activity section
  const PostItem = ({ post }) => {
    return (
      <View style={[styles.activityItem, { borderColor: theme.colors.border }]}>
        {post.image && (
          <Image
            source={typeof post.image === 'string' ? global.getSafeImageUri(post.image) : post.image}
            style={styles.activityImage}
            onError={(e) => {
              console.log('Post image error:', e.nativeEvent.error);
            }}
          />
        )}
        <View style={styles.activityContent}>
          <Text style={[styles.activityText, { color: theme.colors.text }]} numberOfLines={2}>
            {post.content}
          </Text>
          <View style={styles.activityMeta}>
            <View style={styles.activityStats}>
              <Ionicons name="heart" size={16} color={theme.colors.primary} />
              <Text style={[styles.activityStatText, { color: theme.colors.textSecondary }]}>
                {post.likes || 0}
              </Text>
            </View>
            <View style={styles.activityStats}>
              <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.activityStatText, { color: theme.colors.textSecondary }]}>
                {post.comments || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
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
            source={global.getSafeImageUri(userData.avatar)}
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

        {/* Recent Activity Section with User Posts */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Activity</Text>
          
          {userPosts.length > 0 ? (
            <FlatList
              data={userPosts}
              renderItem={({ item }) => <PostItem post={item} />}
              keyExtractor={item => item.id || item._id || String(Math.random())}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptySection}>
              <Text style={{ color: theme.colors.textSecondary }}>
                {currentUserId === userId 
                  ? "You haven't posted anything yet. Share your progress!" 
                  : "This user hasn't posted anything yet."}
              </Text>
              {currentUserId === userId && (
                <TouchableOpacity
                  style={[styles.createPostButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => navigation.navigate('CreatePost')}
                >
                  <Text style={styles.createPostButtonText}>Create Post</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  // Activity items styles
  activityItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(229, 124, 11, 0.1)',
    marginBottom: 8,
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  activityText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  activityStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  activityStatText: {
    fontSize: 12,
    marginLeft: 4,
  },
  createPostButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createPostButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});