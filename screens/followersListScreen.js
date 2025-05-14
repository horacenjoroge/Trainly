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

export default function FollowersList({ navigation }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    loadFollowers();
  }, []);

  const loadFollowers = async () => {
    try {
      setLoading(true);
      const response = await userService.getFollowers();
      setFollowers(response);
    } catch (error) {
      console.error('Error loading followers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowBack = async (userId) => {
    try {
      await userService.followUser(userId);
      // Update the local state to reflect the change
      setFollowers(currentFollowers => 
        currentFollowers.map(follower => 
          follower._id === userId 
            ? { ...follower, isFollowingBack: true } 
            : follower
        )
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const renderFollowerItem = ({ item }) => (
    <View style={[styles.followerItem, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity 
        style={styles.followerInfo}
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
      
      {!item.isFollowingBack && (
        <TouchableOpacity 
          style={[styles.followButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleFollowBack(item._id)}
        >
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      )}
      
      {item.isFollowingBack && (
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
            No followers yet
          </Text>
          <Text style={[styles.emptySubText, { color: theme.colors.textSecondary }]}>
            When people follow you, they'll appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={followers}
          renderItem={renderFollowerItem}
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
});