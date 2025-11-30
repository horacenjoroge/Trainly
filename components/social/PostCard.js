import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { log } from '../../utils/logger';

const API_URL = __DEV__ 
  ? 'http://192.168.100.88:3000'
  : 'https://trainly-backend-production.up.railway.app';

/**
 * Helper function to safely handle image URIs of various formats
 */
const getSafeImageUri = (imageSource) => {
  if (typeof imageSource !== 'string') {
    return imageSource;
  }

  if (imageSource && imageSource.startsWith('file://')) {
    return { uri: imageSource };
  }
  
  if (imageSource && imageSource.startsWith('/data/')) {
    return { uri: `file://${imageSource}` };
  }
  
  if (imageSource && imageSource.includes('ExperienceData')) {
    return { uri: imageSource };
  }
  
  if (imageSource && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
    return { uri: imageSource };
  }
  
  if (imageSource && !imageSource.startsWith('/')) {
    return { uri: `${API_URL}/${imageSource}` };
  }
  
  if (imageSource && imageSource.startsWith('/')) {
    return { uri: `${API_URL}${imageSource}` };
  }
  
  return require('../../assets/images/bike.jpg');
};

/**
 * Helper function to safely extract the user ID for navigation
 */
const getUserIdFromPost = (post) => {
  if (!post || !post.user) return null;
  
  if (post.user._id) return post.user._id;
  if (post.user.id) return post.user.id;
  if (post.user.userId) return post.user.userId;
  
  if (typeof post.user === 'string') return post.user;
  if (post.userId) return post.userId;
  
  return null;
};

/**
 * Format the date for display
 */
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

/**
 * Get user display name safely
 */
const getUserName = (post) => {
  if (!post.user) return 'User';
  if (typeof post.user === 'string') return 'User';
  return post.user.name || post.user.username || 'User';
};

/**
 * PostCard component for displaying social media posts
 */
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

  const handleUserPress = () => {
    const userId = getUserIdFromPost(post);
    
    if (userId) {
      navigation.navigate('UserProfile', { userId });
    } else {
      log('Cannot navigate to profile - missing user ID');
      log('Post user structure:', JSON.stringify(post.user, null, 2));
    }
  };

  return (
    <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={handleUserPress}>
          <Image 
            source={post.user && post.user.avatar 
              ? getSafeImageUri(post.user.avatar) 
              : require('../../assets/images/bike.jpg')} 
            style={styles.userAvatar} 
            onError={(e) => {
              log('Avatar image error:', e.nativeEvent.error);
            }}
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleUserPress}>
            <Text style={[styles.userName, { color: colors.text }]}>{getUserName(post)}</Text>
          </TouchableOpacity>
          <Text style={[styles.postTime, { color: colors.textSecondary }]}>
            {post.createdAt ? formatDate(post.createdAt) : '2 hours ago'}
          </Text>
        </View>
      </View>
      
      {post.content && <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>}
      
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
            log('Post image error:', e.nativeEvent.error);
            log('Failed image URL:', post.image);
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

const styles = StyleSheet.create({
  postCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  workoutDetailsContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  workoutTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutType: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  workoutStatsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutStatText: {
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
  },
});

export default PostCard;

