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

export default function FollowingList({ navigation }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    loadFollowing();
  }, []);

  const loadFollowing = async () => {
    try {
      setLoading(true);
      const response = await userService.getFollowing();
      setFollowing(response);
    } catch (error) {
      console.error('Error loading following:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await userService.unfollowUser(userId);
      // Remove the unfollowed user from the list
      setFollowing(currentFollowing => 
        currentFollowing.filter(user => user._id !== userId)
      );
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const renderFollowingItem = ({ item }) => (
    <View style={[styles.followingItem, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity 
        style={styles.followingInfo}
        onPress={() => navigation.navigate('UserProfile', { userId: item._id })}
      >
        <Image 
          source={{ uri: global.getSafeImageUri(item.avatar || 'https://via.placeholder.com/50') }} 
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
      
      <TouchableOpacity 
        style={[styles.unfollowButton, { borderColor: theme.colors.border }]}
        onPress={() => handleUnfollow(item._id)}
      >
        <Text style={{ color: theme.colors.textSecondary }}>Unfollow</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Following</Text>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Following</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {following.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Not following anyone yet
          </Text>
          <Text style={[styles.emptySubText, { color: theme.colors.textSecondary }]}>
            When you follow people, they'll appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={following}
          renderItem={renderFollowingItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
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
  listContainer: {
    padding: 16,
  },
  followingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 124, 11, 0.2)',
  },
  followingInfo: {
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
  unfollowButton: {
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
});