// HomeScreen.js - Complete with Simplified Progress Integration
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

// Replace with your actual backend URL
const API_URL = 'http://192.168.100.88:3000';
const USER_DATA_KEY = '@user_data';

// Helper function to safely handle image URIs of various formats
const getSafeImageUri = (imageSource) => {
  // If it's already a require statement (local image), return as is
  if (typeof imageSource !== 'string') {
    return imageSource;
  }

  // Handle file:// URIs (from device storage)
  if (imageSource && imageSource.startsWith('file://')) {
    return { uri: imageSource };
  }
  
  // Handle paths that start with "/data/" (internal storage paths)
  if (imageSource && imageSource.startsWith('/data/')) {
    return { uri: `file://${imageSource}` };
  }
  
  // Handle paths that directly reference ExperienceData
  if (imageSource && imageSource.includes('ExperienceData')) {
    return { uri: imageSource };
  }
  
  // Check if the URL starts with http or https
  if (imageSource && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
    return { uri: imageSource };
  }
  
  // If it's a local path without http, add the base URL
  if (imageSource && !imageSource.startsWith('/')) {
    return { uri: `${API_URL}/${imageSource}` };
  }
  
  // If it starts with /, assume it's a local path on the server
  if (imageSource && imageSource.startsWith('/')) {
    return { uri: `${API_URL}${imageSource}` };
  }
  
  // Fallback to default image
  return require('../assets/images/bike.jpg');
};

// Helper function to safely extract the user ID for navigation
const getUserIdFromPost = (post) => {
  if (!post || !post.user) return null;
  
  // Check for different ID field formats
  if (post.user._id) return post.user._id;
  if (post.user.id) return post.user.id;
  if (post.user.userId) return post.user.userId;
  
  // If the user object itself is an ID string
  if (typeof post.user === 'string') return post.user;
  
  // If the post has a userId field
  if (post.userId) return post.userId;
  
  return null;
};

// PostCard component for your HomeScreen
const PostCard = ({ post, onLike, navigation }) => {
  const theme = useTheme();
  const colors = theme.colors;

  const handleLike = async () => {
    if (onLike) {
      onLike(post.id || post._id);
    }
  };

  const handleComment = () => {
    navigation.navigate('Comments', {
      postId: post.id || post._id,
      postContent: post.content,
      postUser: post.user
    });
  };

  // Navigate to user profile when avatar or name is clicked
  const handleUserPress = () => {
    const userId = getUserIdFromPost(post);
    
    if (userId) {
      navigation.navigate('UserProfile', { userId });
    } else {
      console.log('Cannot navigate to profile - missing user ID');
      console.log('Post user structure:', JSON.stringify(post.user, null, 2));
    }
  };

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  // Get user display name safely
  const getUserName = () => {
    if (!post.user) return 'User';
    
    if (typeof post.user === 'string') return 'User';
    
    return post.user.name || post.user.username || 'User';
  };

  return (
    <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={handleUserPress}>
          <Image 
            source={post.user && post.user.avatar 
              ? getSafeImageUri(post.user.avatar) 
              : require('../assets/images/bike.jpg')} 
            style={styles.userAvatar} 
            onError={(e) => {
              console.log('Avatar image error:', e.nativeEvent.error);
            }}
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleUserPress}>
            <Text style={[styles.userName, { color: colors.text }]}>{getUserName()}</Text>
          </TouchableOpacity>
          <Text style={[styles.postTime, { color: colors.textSecondary }]}>
            {post.createdAt ? formatDate(post.createdAt) : '2 hours ago'}
          </Text>
        </View>
      </View>
      
      {post.content && <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>}
      
      {/* Workout details section (if available) */}
      {post.workoutDetails && post.workoutDetails.type && (
        <View style={[styles.workoutDetailsContainer, { backgroundColor: `${colors.secondary}15` }]}>
          <View style={styles.workoutTypeContainer}>
            <Ionicons name="fitness-outline" size={16} color={colors.primary} />
            <Text style={[styles.workoutType, { color: colors.primary }]}>{post.workoutDetails.type}</Text>
          </View>
          
          <View style={styles.workoutStatsContainer}>
            {post.workoutDetails.duration > 0 && (
              <View style={styles.workoutStat}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.workoutStatText, { color: colors.textSecondary }]}>{post.workoutDetails.duration} min</Text>
              </View>
            )}
            
            {post.workoutDetails.calories > 0 && (
              <View style={styles.workoutStat}>
                <Ionicons name="flame-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.workoutStatText, { color: colors.textSecondary }]}>{post.workoutDetails.calories} cal</Text>
              </View>
            )}
          </View>
        </View>
      )}
      
      {post.image && (
        <Image 
          source={getSafeImageUri(post.image)} 
          style={styles.postImage} 
          resizeMode="cover" 
          onError={(e) => {
            console.log('Post image error:', e.nativeEvent.error);
            console.log('Failed image URL:', post.image);
          }}
        />
      )}
      
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLike}
        >
          <Ionicons 
            name={post.isLiked ? "heart" : "heart-outline"} 
            size={20} 
            color={post.isLiked ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>{post.likes || 0} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleComment}
        >
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>{post.comments || 0} Comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Simplified Progress Card - Just displays basic stats
const ProgressCard = ({ stats, loading = false, onViewFullStats }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Helper function to format duration
  const formatDuration = (totalMinutes) => {
    if (totalMinutes < 60) {
      return `${totalMinutes}m`;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressTitle, { color: colors.primary }]}>My Progress</Text>
        <TouchableOpacity onPress={onViewFullStats}>
          <Text style={[styles.progressEdit, { color: colors.secondary }]}>View Stats</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.progressLoading}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.progressLoadingText, { color: colors.textSecondary }]}>
            Loading progress...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.progressStats}>
            <View style={styles.progressStatItem}>
              <Ionicons name="trophy-outline" size={24} color={colors.primary} />
              <Text style={[styles.progressStatValue, { color: colors.primary }]}>
                {stats.totalWorkouts || 0}
              </Text>
              <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>
                Workouts
              </Text>
            </View>
            <View style={styles.progressStatItem}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <Text style={[styles.progressStatValue, { color: colors.primary }]}>
                {formatDuration(stats.totalDuration || 0)}
              </Text>
              <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>
                Time
              </Text>
            </View>
            <View style={styles.progressStatItem}>
              <Ionicons name="flame-outline" size={24} color={colors.primary} />
              <Text style={[styles.progressStatValue, { color: colors.primary }]}>
                {Math.round(stats.totalCalories || 0)}
              </Text>
              <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>
                Calories
              </Text>
            </View>
          </View>
          
          {/* Simple weekly goal progress */}
          <View style={styles.weeklyGoalContainer}>
            <View style={styles.weeklyGoalHeader}>
              <Text style={[styles.weeklyGoalTitle, { color: colors.text }]}>
                This Week
              </Text>
              <Text style={[styles.weeklyGoalText, { color: colors.textSecondary }]}>
                {stats.weeklyWorkouts || 0}/{stats.weeklyGoal || 3} workouts
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: `${colors.primary}20` }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${Math.min(((stats.weeklyWorkouts || 0) / (stats.weeklyGoal || 3)) * 100, 100)}%`
                  }
                ]} 
              />
            </View>
          </View>

          {/* Quick insight */}
          {stats.lastWorkout && (
            <View style={styles.lastWorkoutContainer}>
              <Text style={[styles.lastWorkoutText, { color: colors.textSecondary }]}>
                Last workout: {stats.lastWorkout.type} • {stats.lastWorkout.timeAgo}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

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

  // Make the helper function globally available
  useEffect(() => {
    global.getSafeImageUri = getSafeImageUri;
  }, []);

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
          
          console.log('Progress stats loaded from API');
        } else {
          throw new Error('Invalid API response');
        }
      } catch (apiError) {
        console.log('API failed, trying local data:', apiError.message);
        
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
          
          console.log('Progress stats calculated from local data');
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
          
          console.log('No workout data found');
        }
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
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

  // Debug fetched posts
  const debugPostStructure = (postsData) => {
    if (!postsData || !postsData.length) return;
    
    console.log('FIRST POST STRUCTURE:');
    console.log(JSON.stringify(postsData[0], null, 2));
    
    const hasIds = postsData.map(post => {
      const userId = getUserIdFromPost(post);
      return { 
        postId: post.id || post._id || 'no-id',
        hasUserId: !!userId,
        userId: userId || 'none'
      };
    });
    
    console.log('User ID availability in posts:');
    console.log(JSON.stringify(hasIds, null, 2));
  };

  // Fetch user profile and posts
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Check for updated user name in local storage
      try {
        const localUserData = await AsyncStorage.getItem(USER_DATA_KEY);
        if (localUserData) {
          const parsedData = JSON.parse(localUserData);
          if (parsedData.fullName) {
            setUserName(parsedData.fullName);
          }
        }
      } catch (localError) {
        console.error('Error reading local user data:', localError);
      }
      
      if (!token) {
        // If no data from API yet, use sample data
        setUserProfile({
          name: userName,
        });
        
        setPosts([
          {
            id: '1',
            user: {
              _id: '507f1f77bcf86cd799439011',
              name: 'Marion',
              avatar: require('../assets/images/run.jpg')
            },
            content: 'Just completed my first marathon! Feeling incredibly proud and exhausted!',
            image: require('../assets/images/run.jpg'),
            likes: 156,
            comments: 24,
            isLiked: false
          },
          {
            id: '2',
            user: {
              _id: '507f1f77bcf86cd799439012',
              name: 'Mishael',
              avatar: require('../assets/images/bike.jpg')
            },
            content: 'Daily workout done! 💪 Pushing my limits every day.',
            image: require('../assets/images/bike.jpg'),
            likes: 87,
            comments: 12,
            isLiked: false
          }
        ]);
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
        
        setUserProfile({
          name: profileData.name || userName,
        });
      } catch (error) {
        console.error('Error fetching profile from service:', error);
        
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
          
          setUserProfile({
            name: profileRes.data.name || userName,
          });
        } catch (axiosError) {
          console.error('Error fetching profile with axios:', axiosError);
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
        console.error('Error fetching posts from service:', error);
        
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
          console.error('Error fetching posts with axios:', axiosError);
          setPosts([
            {
              id: '1',
              user: {
                _id: '507f1f77bcf86cd799439011',
                name: 'Marion',
                avatar: require('../assets/images/run.jpg')
              },
              content: 'Just completed my first marathon! Feeling incredibly proud and exhausted!',
              image: require('../assets/images/run.jpg'),
              likes: 156,
              comments: 24,
              isLiked: false
            },
            {
              id: '2',
              user: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Mishael',
                avatar: require('../assets/images/bike.jpg')
              },
              content: 'Daily workout done! 💪 Pushing my limits every day.',
              image: require('../assets/images/bike.jpg'),
              likes: 87,
              comments: 12,
              isLiked: false
            }
          ]);
        }
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Add a listener for focus events to refresh data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
      fetchProgressData();
    });

    return unsubscribe;
  }, [navigation]);

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    fetchProgressData();
  };

  // Handle like/unlike post
  const handleLikePost = async (postId) => {
    if (!postId) {
      console.log('Cannot like post - missing ID');
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
        console.error('Error liking post with service:', error);
        
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
          console.error('Error liking post with axios:', axiosError);
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
      console.error('Error handling like:', error);
    }
  };

  // Navigate to full stats screen
  const handleViewFullStats = () => {
    navigation.navigate('Stats'); // Assuming you have a Stats screen
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchProgressData();
  }, []);

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
  progressContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressEdit: {
    fontWeight: '600',
  },
  progressLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  progressLoadingText: {
    marginLeft: 10,
    fontSize: 14,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  progressStatLabel: {
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weeklyGoalContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  weeklyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weeklyGoalTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  weeklyGoalText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  lastWorkoutContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  lastWorkoutText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
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