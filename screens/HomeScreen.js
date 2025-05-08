// HomeScreen.js
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual backend URL
const API_URL = 'http://192.168.100.88:3000';

// Color Palette
const colors = {
  background: '#120B42',
  primary: '#E57C0B',
  surface: '#1A144B',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#4A90E2',
};

// PostCard component for your HomeScreen
const PostCard = ({ post, onLike, navigation }) => {
  const handleLike = async () => {
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleComment = () => {
    navigation.navigate('Comments', {
      postId: post.id,
      postContent: post.content,
      postUser: post.user
    });
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

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image 
          source={post.user.avatar ? { uri: post.user.avatar } : require('../assets/images/bike.jpg')} 
          style={styles.userAvatar} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.postTime}>
            {post.createdAt ? formatDate(post.createdAt) : '2 hours ago'}
          </Text>
        </View>
      </View>
      
      {post.content && <Text style={styles.postContent}>{post.content}</Text>}
      
      {/* Workout details section (if available) */}
      {post.workoutDetails && post.workoutDetails.type && (
        <View style={styles.workoutDetailsContainer}>
          <View style={styles.workoutTypeContainer}>
            <Ionicons name="fitness-outline" size={16} color={colors.primary} />
            <Text style={styles.workoutType}>{post.workoutDetails.type}</Text>
          </View>
          
          <View style={styles.workoutStatsContainer}>
            {post.workoutDetails.duration > 0 && (
              <View style={styles.workoutStat}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.workoutStatText}>{post.workoutDetails.duration} min</Text>
              </View>
            )}
            
            {post.workoutDetails.calories > 0 && (
              <View style={styles.workoutStat}>
                <Ionicons name="flame-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.workoutStatText}>{post.workoutDetails.calories} cal</Text>
              </View>
            )}
          </View>
        </View>
      )}
      
      {post.image && (
        <Image 
          source={typeof post.image === 'string' ? { uri: post.image } : post.image} 
          style={styles.postImage} 
          resizeMode="cover" 
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
          <Text style={styles.actionText}>{post.likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleComment}
        >
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{post.comments} Comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
// Personal Progress Card
const ProgressCard = ({ stats, onEdit }) => {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>My Progress</Text>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.progressEdit}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressStats}>
        <View style={styles.progressStatItem}>
          <Ionicons name="trophy-outline" size={24} color={colors.primary} />
          <Text style={styles.progressStatValue}>{stats.workouts}</Text>
          <Text style={styles.progressStatLabel}>Workouts</Text>
        </View>
        <View style={styles.progressStatItem}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text style={styles.progressStatValue}>{stats.hours}</Text>
          <Text style={styles.progressStatLabel}>Hours</Text>
        </View>
        <View style={styles.progressStatItem}>
          <Ionicons name="flame-outline" size={24} color={colors.primary} />
          <Text style={styles.progressStatValue}>{stats.calories}</Text>
          <Text style={styles.progressStatLabel}>Calories</Text>
        </View>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user profile and posts
  const fetchData = async () => {
    setLoading(true);
    try {
      // Get JWT token from storage
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        // If no data from API yet, use sample data
        setUserProfile({
          name: 'Horace',
          stats: { workouts: 12, hours: 5.2, calories: 324 }
        });
        
        // Use your existing sample data
        setPosts([
          {
            id: '1',
            user: {
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

      // Configure headers with token
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      // Fetch user profile from API
      try {
        const profileRes = await axios.get(`${API_URL}/api/users/profile`, config);
        setUserProfile(profileRes.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to sample data
        setUserProfile({
          name: 'Horace',
          stats: { workouts: 12, hours: 5.2, calories: 324 }
        });
      }

      // Fetch posts from API
      try {
        const postsRes = await axios.get(`${API_URL}/api/posts`, config);
        setPosts(postsRes.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Fallback to sample data
        setPosts([
          {
            id: '1',
            user: {
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
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Handle like/unlike post
  const handleLikePost = async (postId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        // Just update UI locally if we don't have a token yet
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
              : post
          )
        );
        return;
      }

      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      // Call API to like/unlike post
      try {
        const res = await axios.put(`${API_URL}/api/posts/${postId}/like`, {}, config);
        
        // Update posts state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: res.data.likes, isLiked: res.data.isLiked }
              : post
          )
        );
      } catch (error) {
        console.error('Error liking post:', error);
        // Fall back to local update
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  // Handle edit profile stats
  const handleEditStats = () => {
    // Navigate to EditStatsScreen with current stats
    navigation.navigate('EditStats', {
      stats: userProfile?.stats || { workouts: 12, hours: 5.2, calories: 324 },
      onUpdate: fetchData // Pass callback to refresh data when updated
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Add a listener for when the screen comes into focus to refresh data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor={colors.background} 
        barStyle="light-content" 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Welcome back, {userProfile?.name || 'Horace'}!</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('CreatePost')}
            >
              <Ionicons name="add-circle-outline" size={28} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={28} color={colors.text} />
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
          stats={userProfile?.stats || { workouts: 12, hours: 5.2, calories: 324 }}
          onEdit={handleEditStats}
        />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('TrainingSelection')}
          >
            <Ionicons name="fitness-outline" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Start Training</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Ionicons name="share-social-outline" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Share Progress</Text>
          </TouchableOpacity>
        </View>

        {/* Community Posts */}
        <View style={styles.communitySection}>
          <Text style={styles.communitySectionTitle}>Community Feed</Text>
          {posts.length > 0 ? (
  <FlatList 
    data={posts}
    renderItem={({ item }) => (
      <PostCard 
        post={item}
        onLike={handleLikePost}
        navigation={navigation}  // Pass navigation prop
      />
    )}
    keyExtractor={item => item.id}
    scrollEnabled={false}
  />
) : (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateText}>No posts yet. Be the first to share!</Text>
    <TouchableOpacity 
      style={styles.emptyStateButton}
      onPress={() => navigation.navigate('CreatePost')}
    >
      <Text style={styles.emptyStateButtonText}>Create Post</Text>
    </TouchableOpacity>
  </View>
)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
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
  },
  greeting: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    backgroundColor: colors.surface,
    margin: 16,
    borderRadius: 16,
    padding: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressEdit: {
    color: colors.accent,
    fontWeight: '600',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  progressStatLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  quickActionButton: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    width: '45%',
    justifyContent: 'center',
  },
  quickActionText: {
    color: colors.primary,
    marginLeft: 10,
    fontWeight: '600',
  },
  communitySection: {
    backgroundColor: colors.surface,
    margin: 16,
    borderRadius: 16,
    padding: 15,
  },
  communitySectionTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  postCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  postTime: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  postContent: {
    color: colors.text,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: colors.textSecondary,
    marginLeft: 5,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  // Additional styles to add to your HomeScreen styles
workoutDetailsContainer: {
  backgroundColor: 'rgba(33, 150, 243, 0.1)',
  padding: 12,
  borderRadius: 8,
  marginVertical: 8,
},
workoutTypeContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},
workoutType: {
  fontSize: 14,
  fontWeight: '600',
  color: colors.primary,
  marginLeft: 6,
},
workoutStatsContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
},
workoutStat: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 16,
},
workoutStatText: {
  fontSize: 12,
  color: colors.textSecondary,
  marginLeft: 4,
},
});

export default HomeScreen;