import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Keyboard,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDistanceToNow } from 'date-fns';
import { log, logError } from '../utils/logger';

const API_URL = 'https://trainingapp-api-production.up.railway.app';

const theme = {
  colors: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    border: '#DDDDDD',
    primary: '#2196F3',
    card: '#FFFFFF',
    success: '#4CAF50',
    error: '#f44336',
  },
};

// Helper function to safely handle image URIs (same as HomeScreen)
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
  
  // Fallback to placeholder URL
  return { uri: 'https://via.placeholder.com/50' };
};

const CommentScreen = ({ route, navigation }) => {
  const { postId, postContent, postUser } = route.params;
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  // Fetch comments when screen loads
  useEffect(() => {
    fetchComments();
    fetchUserInfo();
    
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (inputRef.current) {
          setTimeout(() => inputRef.current.focus(), 100);
        }
      }
    );
    
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUserInfo(JSON.parse(userData));
      }
    } catch (error) {
      logError('Error fetching user info:', error);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        setComments([]);
        setLoading(false);
        return;
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const response = await axios.get(`${API_URL}/api/posts/${postId}/comments`, config);
      setComments(response.data);
    } catch (error) {
      logError('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('Authentication Required', 'Please log in to comment.');
        setSubmitting(false);
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      const response = await axios.post(
        `${API_URL}/api/posts/${postId}/comments`, 
        { text: newComment.trim() },
        config
      );
      
      // Add new comment to the list
      setComments([response.data, ...comments]);
      setNewComment('');
      
      // Dismiss keyboard
      Keyboard.dismiss();
    } catch (error) {
      logError('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = ({ item }) => {
    const formattedDate = formatDistanceToNow(new Date(item.date), { addSuffix: true });
    
    return (
      <View style={styles.commentItem}>
        <Image 
          source={item.user && item.user.avatar 
            ? getSafeImageUri(item.user.avatar) 
            : getSafeImageUri(null)} 
          style={styles.commentAvatar}
          onError={(e) => {
            log('Comment avatar image error:', e.nativeEvent.error);
          }}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{item.user.name}</Text>
            <Text style={styles.commentTime}>{formattedDate}</Text>
          </View>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const renderListHeader = () => (
    <View style={styles.originalPostContainer}>
      <View style={styles.originalPostHeader}>
        <Image 
          source={postUser && postUser.avatar 
            ? getSafeImageUri(postUser.avatar) 
            : getSafeImageUri(null)} 
          style={styles.postAvatar}
          onError={(e) => {
            log('Post avatar image error:', e.nativeEvent.error);
          }}
        />
        <View>
          <Text style={styles.postAuthor}>{postUser.name}</Text>
          <Text style={styles.postCaption}>Original post</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{postContent}</Text>
    </View>
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.background,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              }),
            },
          ],
        }
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Comments list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderComment}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      
      {/* Comment input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <View style={[styles.commentInputWrapper, { backgroundColor: theme.colors.surface }]}>
          <Image 
            source={userInfo && userInfo.avatar 
              ? getSafeImageUri(userInfo.avatar) 
              : getSafeImageUri(null)} 
            style={styles.inputAvatar}
            onError={(e) => {
              log('User input avatar image error:', e.nativeEvent.error);
            }}
          />
          <TextInput
            ref={inputRef}
            style={[styles.commentInput, { backgroundColor: theme.colors.background }]}
            placeholder="Add a comment..."
            placeholderTextColor={theme.colors.textSecondary}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { opacity: newComment.trim() ? 1 : 0.5 }
            ]} 
            onPress={submitComment}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

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
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  originalPostContainer: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  originalPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postAuthor: {
    fontWeight: 'bold',
    fontSize: 15,
    color: theme.colors.text,
  },
  postCaption: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  postContent: {
    fontSize: 16,
    color: theme.colors.text,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme.colors.surface,
    marginBottom: 1,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
    color: theme.colors.text,
  },
  commentTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  commentText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.text,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CommentScreen;