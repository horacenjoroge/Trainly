// HomeScreen.js - Fixed Bio Sync Issue
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService, postService } from '../services/api';
import { workoutAPI } from '../services/workoutAPI';
import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import PostCard from '../components/social/PostCard';
import ProgressCard from '../components/home/ProgressCard';
import { log, logError } from '../utils/logger';

// Replace with your actual backend URL
const API_URL = __DEV__ 
  ? 'http://192.168.100.88:3000'  // Local development
  : 'https://trainly-backend-production.up.railway.app';  // Production
const USER_DATA_KEY = '@user_data';



const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  const [posts, setPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [progressStats, setProgressStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    weeklyWorkouts: 0,
    weeklyGoal: 3,
    lastWorkout: null
  });
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('User');

  // getSafeImageUri is now imported from utils/imageUtils.js - no need for global

  // Load user name and bio from AsyncStorage (FIXED FUNCTION)
  const loadUserNameAndBio = async () => {
    try {
      const localUserData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (localUserData) {
        const parsedData = JSON.parse(localUserData);
        log('🔄 HomeScreen: Loading fresh user data from AsyncStorage');
        
        // Update user name if available
        if (parsedData.fullName) {
          setUserName(parsedData.fullName);
          log('✅ HomeScreen: Updated userName to:', parsedData.fullName);
        }
        
        // Update user profile if we have it
        if (userProfile) {
          setUserProfile(prev => ({
            ...prev,
            name: parsedData.fullName || prev.name,
            bio: parsedData.bio || prev.bio
          }));
          log('✅ HomeScreen: Updated userProfile bio to:', parsedData.bio);
        }
      }
    } catch (error) {
      logError('❌ HomeScreen: Error loading user data from AsyncStorage:', error);
    }
  };

  // Simplified progress fetching - just get basic summary
  const fetchProgressData = async () => {
    setProgressLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        // Set default for non-authenticated users
        setProgressStats({
          totalWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0,
          weeklyWorkouts: 0,
          weeklyGoal: 3,
          lastWorkout: null
        });
        setProgressLoading(false);
        return;
      }

      try {
        // Try to get basic stats from your API
        const response = await workoutAPI.getWorkoutStats('month');
        
        if (response && response.status === 'success' && response.data && response.data.summary) {
          const summary = response.data.summary;
          
          // Calculate weekly workouts from trends or use 0
          const weeklyWorkouts = response.data.trends 
            ? response.data.trends.reduce((sum, trend) => sum + (trend.count || 0), 0)
            : 0;
          
          // Find last workout info
          let lastWorkout = null;
          if (response.data.trends && response.data.trends.length > 0) {
            const recentTrend = response.data.trends
              .filter(t => t.count > 0)
              .pop();
            
            if (recentTrend) {
              const date = new Date(recentTrend._id);
              const now = new Date();
              const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
              
              lastWorkout = {
                type: 'Workout',
                timeAgo: diffDays === 0 ? 'today' : diffDays === 1 ? 'yesterday' : `${diffDays} days ago`
              };
            }
          }
          
          setProgressStats({
            totalWorkouts: summary.totalWorkouts || 0,
            totalDuration: Math.floor((summary.totalDuration || 0) / 60), // Convert to minutes
            totalCalories: summary.totalCalories || 0,
            weeklyWorkouts: weeklyWorkouts,
            weeklyGoal: 3, // Could be made user-configurable
            lastWorkout: lastWorkout
          });
          
          log('Progress stats loaded from API');
        } else {
          throw new Error('Invalid API response');
        }
      } catch (apiError) {
        log('API failed, trying local data:', apiError.message);
        
        // Fallback to local workout history
        const historyData = await AsyncStorage.getItem('workoutHistory');
        if (historyData) {
          const workouts = JSON.parse(historyData);
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          // Calculate basic stats from local data
          const weeklyWorkouts = workouts.filter(w => 
            new Date(w.date || w.startTime) >= weekAgo
          ).length;
          
          const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
          const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
          
          let lastWorkout = null;
          if (workouts.length > 0) {
            const last = workouts[workouts.length - 1];
            const lastDate = new Date(last.date || last.startTime);
            const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
            
            lastWorkout = {
              type: last.type || 'Workout',
              timeAgo: diffDays === 0 ? 'today' : diffDays === 1 ? 'yesterday' : `${diffDays} days ago`
            };
          }
          
          setProgressStats({
            totalWorkouts: workouts.length,
            totalDuration: Math.floor(totalDuration / 60),
            totalCalories: totalCalories,
            weeklyWorkouts: weeklyWorkouts,
            weeklyGoal: 3,
            lastWorkout: lastWorkout
          });
          
          log('Progress stats calculated from local data');
        } else {
          // No data available
          setProgressStats({
            totalWorkouts: 0,
            totalDuration: 0,
            totalCalories: 0,
            weeklyWorkouts: 0,
            weeklyGoal: 3,
            lastWorkout: null
          });
          
          log('No workout data found');
        }
      }
    } catch (error) {
      logError('Error fetching progress data:', error);
      // Set default stats on error
      setProgressStats({
        totalWorkouts: 0,
        totalDuration: 0,
        totalCalories: 0,
        weeklyWorkouts: 0,
        weeklyGoal: 3,
        lastWorkout: null
      });
    } finally {
      setProgressLoading(false);
    }
  };

  // Helper function to safely extract the user ID from a post
  const getUserIdFromPost = (post) => {
    if (!post || !post.user) return null;
    
    if (post.user._id) return post.user._id;
    if (post.user.id) return post.user.id;
    if (post.user.userId) return post.user.userId;
    
    if (typeof post.user === 'string') return post.user;
    if (post.userId) return post.userId;
    
    return null;
  };

  // Debug fetched posts
  const debugPostStructure = (postsData) => {
    if (!postsData || !postsData.length) return;
    
    log('FIRST POST STRUCTURE:');
    log(JSON.stringify(postsData[0], null, 2));
    
    const hasIds = postsData.map(post => {
      const userId = getUserIdFromPost(post);
      return { 
        postId: post.id || post._id || 'no-id',
        hasUserId: !!userId,
        userId: userId || 'none'
      };
    });
    
    log('User ID availability in posts:');
    log(JSON.stringify(hasIds, null, 2));
  };

  // Fetch user profile and posts
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      // ALWAYS load fresh user data from AsyncStorage first
      await loadUserNameAndBio();
      
      if (!token) {
        // No token - user not authenticated, show empty state
        setUserProfile({
          name: userName,
        });
        setPosts([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Try to get user profile from API using our service
      try {
        const profileData = await userService.getUserProfile();
        
        if (profileData && profileData.name) {
          setUserName(profileData.name);
        }
        
        // Also load fresh data from AsyncStorage for bio
        const cachedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
        let dynamicBio = 'Fitness enthusiast';
        
        if (cachedUserData) {
          const parsedData = JSON.parse(cachedUserData);
          if (parsedData.bio) {
            dynamicBio = parsedData.bio;
          }
        }
        
        setUserProfile({
          name: profileData.name || userName,
          bio: profileData.bio || dynamicBio, // Use fresh bio from AsyncStorage
        });
        
        log('🔄 HomeScreen: Profile updated with bio:', profileData.bio || dynamicBio);
      } catch (error) {
        logError('Error fetching profile from service:', error);
        
        // Try with axios as fallback
        try {
          const config = {
            headers: {
              'x-auth-token': token
            }
          };

          const profileRes = await axios.get(`${API_URL}/api/users/profile`, config);
          
          if (profileRes.data && profileRes.data.name) {
            setUserName(profileRes.data.name);
          }
          
          // Also load fresh bio from AsyncStorage
          const cachedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
          let dynamicBio = 'Fitness enthusiast';
          
          if (cachedUserData) {
            const parsedData = JSON.parse(cachedUserData);
            if (parsedData.bio) {
              dynamicBio = parsedData.bio;
            }
          }
          
          setUserProfile({
            name: profileRes.data.name || userName,
            bio: profileRes.data.bio || dynamicBio,
          });
        } catch (axiosError) {
          logError('Error fetching profile with axios:', axiosError);
          setUserProfile({
            name: userName,
          });
        }
      }

      // Fetch posts from API
      try {
        const postsData = await postService.getPosts();
        
        debugPostStructure(postsData);
        
        if (postsData && postsData.length > 0) {
          const processedPosts = postsData.map(post => {
            let postUser = post.user;
            
            if (typeof postUser === 'string') {
              postUser = { _id: postUser, name: 'User' };
            } else if (!postUser) {
              postUser = { name: 'User' };
            }
            
            const postId = post.id || post._id;
            
            return {
              ...post,
              id: postId,
              _id: postId,
              user: postUser,
              likes: typeof post.likes === 'number' ? post.likes : 0,
              comments: typeof post.comments === 'number' ? post.comments : 0
            };
          });
          
          setPosts(processedPosts);
        } else {
          throw new Error('No posts returned from service');
        }
      } catch (error) {
        logError('Error fetching posts from service:', error);
        
        // Try with axios as fallback
        try {
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          
          const postsRes = await axios.get(`${API_URL}/api/posts`, config);
          
          debugPostStructure(postsRes.data);
          
          const processedPosts = postsRes.data.map(post => {
            let postUser = post.user;
            
            if (typeof postUser === 'string') {
              postUser = { _id: postUser, name: 'User' };
            } else if (!postUser) {
              postUser = { name: 'User' };
            }
            
            const postId = post.id || post._id;
            
            return {
              ...post,
              id: postId,
              _id: postId,
              user: postUser,
              likes: typeof post.likes === 'number' ? post.likes : 0,
              comments: typeof post.comments === 'number' ? post.comments : 0
            };
          });
          
          setPosts(processedPosts);
        } catch (axiosError) {
          logError('Error fetching posts with axios:', axiosError);
          // Don't set fake data - show empty state instead
          setPosts([]);
        }
      }
      
    } catch (error) {
      logError('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // FIXED: Use useFocusEffect to reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      log('🎯 HomeScreen: Screen focused, refreshing data');
      fetchData();
      fetchProgressData();
    }, [])
  );

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    fetchProgressData();
  };

  // Handle like/unlike post
  const handleLikePost = async (postId) => {
    if (!postId) {
      log('Cannot like post - missing ID');
      return;
    }
    
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            (post.id === postId || post._id === postId) 
              ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
              : post
          )
        );
        return;
      }

      try {
        const updatedPost = await postService.likePost(postId);
        
        setPosts(prevPosts => 
          prevPosts.map(post => 
            (post.id === postId || post._id === postId) 
              ? { ...post, likes: updatedPost.likes, isLiked: updatedPost.isLiked }
              : post
          )
        );
      } catch (error) {
        logError('Error liking post with service:', error);
        
        try {
          const config = {
            headers: {
              'x-auth-token': token
            }
          };

          const res = await axios.put(`${API_URL}/api/posts/${postId}/like`, {}, config);
          
          setPosts(prevPosts => 
            prevPosts.map(post => 
              (post.id === postId || post._id === postId) 
                ? { ...post, likes: res.data.likes, isLiked: res.data.isLiked }
                : post
            )
          );
        } catch (axiosError) {
          logError('Error liking post with axios:', axiosError);
          setPosts(prevPosts => 
            prevPosts.map(post => 
              (post.id === postId || post._id === postId) 
                ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
                : post
            )
          );
        }
      }
    } catch (error) {
      logError('Error handling like:', error);
    }
  };

  // Navigate to full stats screen
  const handleViewFullStats = () => {
    navigation.navigate('Stats'); // Assuming you have a Stats screen
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor={colors.background} 
        barStyle={theme.isDarkMode ? "light-content" : "dark-content"} 
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.greeting, { color: '#FFFFFF' }]}>Welcome back, {userProfile?.name || userName}!</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('CreatePost')}
            >
              <Ionicons name="add-circle-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]} 
            tintColor={colors.primary}
          />
        }
      >
        {/* Progress Card */}
        <ProgressCard 
          stats={progressStats}
          loading={progressLoading}
          onViewFullStats={handleViewFullStats}
        />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('TrainingSelection')}
          >
            <Ionicons name="fitness-outline" size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.primary }]}>Start Training</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Ionicons name="share-social-outline" size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.primary }]}>Share Progress</Text>
          </TouchableOpacity>
        </View>

        {/* Community Posts */}
        <View style={[styles.communitySection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.communitySectionTitle, { color: colors.primary }]}>Community Feed</Text>
          {posts.length > 0 ? (
            <FlatList 
              data={posts}
              renderItem={({ item }) => (
                <PostCard 
                  post={item}
                  onLike={handleLikePost}
                  navigation={navigation}
                />
              )}
              keyExtractor={item => String(item.id || item._id || Math.random())}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No posts yet. Be the first to share!
              </Text>
              <TouchableOpacity 
                style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('CreatePost')}
              >
                <Text style={[styles.emptyStateButtonText, { color: '#FFFFFF' }]}>Create Post</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Updated styles for modern design
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIconButton: {
    marginLeft: 15,
    padding: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    width: '48%',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionText: {
    marginLeft: 10,
    fontWeight: '600',
  },
  communitySection: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  communitySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  postCard: {
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 125, 44, 0.5)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
  },
  postContent: {
    marginBottom: 12,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginVertical: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    elevation: 2,
  },
  emptyStateButtonText: {
    fontWeight: 'bold',
  },
  workoutDetailsContainer: {
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
  },
  workoutTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutType: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  workoutStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  workoutStatText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default HomeScreen;