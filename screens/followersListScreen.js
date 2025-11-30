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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeImageUri } from '../utils/imageUtils';
import { log, logError, logWarn } from '../utils/logger';

export default function FollowersList({ route, navigation }) {
  const { userId } = route.params || {};
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [viewingUserName, setViewingUserName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Try userData first
        let data = await AsyncStorage.getItem('userData');
        if (!data) {
          // Fallback to @user_data
          data = await AsyncStorage.getItem('@user_data');
        }
        
        if (data) {
          const user = JSON.parse(data);
          const foundUserId = user._id || user.id;
          setCurrentUserId(foundUserId);
          log('✅ FollowersList: Found current user ID:', foundUserId);
        } else {
          logWarn('⚠️ FollowersList: No user data found in storage');
        }
      } catch (error) {
        logError('❌ FollowersList: Error getting current user:', error);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    log('🔄 FollowersList: Params userId:', userId);
    
    if (userId) {
      loadFollowers();
      loadUserDetails();
    } else {
      setError('No user ID provided');
      setLoading(false);
    }
  }, [userId]);

  const loadUserDetails = async () => {
    try {
      const userData = await userService.getUserById(userId);
      setViewingUserName(userData?.name || '');
    } catch (error) {
      logError('Error loading user details:', error);
    }
  };

  const loadFollowers = async () => {
    try {
      setLoading(true);
      setError(null);
      log('🔄 FollowersList: Loading followers for userId:', userId);
      
      const response = await userService.getFollowers(userId);
      log('✅ FollowersList: Loaded followers data:', response?.length || 0, 'users');
      setFollowers(response || []);
    } catch (error) {
      logError('❌ FollowersList: Error loading followers:', error);
      setError('Failed to load followers list');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowBack = async (userIdToFollow) => {
    try {
      await userService.followUser(userIdToFollow);
      setFollowers(currentFollowers =>
        currentFollowers.map(follower =>
          follower._id === userIdToFollow
            ? { ...follower, isFollowingBack: true }
            : follower
        )
      );
      setTimeout(loadFollowers, 500);
    } catch (error) {
      logError('Error following user:', error);
    }
  };

  const renderFollowerItem = ({ item }) => (
    <View style={[styles.followerItem, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity
        style={styles.followerInfo}
        onPress={() => navigation.navigate('UserProfile', { userId: item._id })}
      >
        <Image
          source={getSafeImageUri(item.avatar || 'https://via.placeholder.com/50')}
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

      {currentUserId === userId && !item.isFollowingBack && (
        <TouchableOpacity
          style={[styles.followButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleFollowBack(item._id)}
        >
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      )}

      {currentUserId === userId && item.isFollowingBack && (
        <View style={[styles.followingLabel, { borderColor: theme.colors.border }]}>
          <Text style={{ color: theme.colors.textSecondary }}>Following</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Followers</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading followers list...
          </Text>
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
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Followers</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {error || 'No user ID provided'}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Followers</Text>
        <View style={{ width: 24 }} />
      </View>

      {followers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {currentUserId === userId 
              ? "You don't have any followers yet" 
              : `${viewingUserName ? viewingUserName : 'This user'} doesn't have any followers yet`}
          </Text>
          <Text style={[styles.emptySubText, { color: theme.colors.textSecondary }]}>
            {currentUserId === userId 
              ? "When people follow you, they'll appear here"
              : "When people follow them, they'll appear here"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={followers}
          renderItem={renderFollowerItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 124, 11, 0.2)',
  },
  followerInfo: {
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
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  followingLabel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
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
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});