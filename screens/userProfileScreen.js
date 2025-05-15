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
  const { userId } = route.params;
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadCurrentUser();
    loadUserProfile();
  }, []);

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
      
      // This would need a new API endpoint to get another user's profile
      // For now, we'll simulate it with the sample data
      const response = await fetch(`${API_URL}/users/${userId}`);
      const profileData = await response.json();
      
      // Check if current user is following this user
      const followingData = await userService.getFollowing();
      const isFollowingUser = followingData.some(user => user._id === userId);
      
      setUserData(profileData);
      setIsFollowing(isFollowingUser);
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Fallback to mock data for demonstration
      setUserData({
        _id: userId,
        name: 'Other User',
        bio: 'Fitness enthusiast',
        avatar: 'https://via.placeholder.com/150',
        stats: {
          workouts: 45,
          hours: 78,
          calories: 12500
        },
        followers: 24,
        following: 36
      });
      
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await userService.followUser(userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Could not perform this action');
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

  if (!userData) {
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
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>User not found</Text>
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
              // Fallback to placeholder on error
              setUserData(prev => ({
                ...prev,
                avatar: 'https://via.placeholder.com/150'
              }));
            }}
          />
          
          <Text style={[styles.name, { color: theme.colors.text }]}>{userData.name}</Text>
          <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
            {userData.bio}
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
              {userData.stats.workouts}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Workouts</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.stat, styles.statBorder, { borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('UserFollowers', { userId: userId })}
          >
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.followers}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Followers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.stat, styles.statBorder, { borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('UserFollowing', { userId: userId })}
          >
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.following}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Following</Text>
          </TouchableOpacity>
          
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.stats.calories || 0}
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