import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, colors } from '../theme';

const DUMMY_POSTS = [
  {
    id: '1',
    user: { name: 'Jeremy', avatar: require('../assets/images/trail.jpg') },
    text: 'Just completed my first 10k run!',
    workoutDetails: { type: 'Running', duration: 60 },
    images: [require('../assets/images/run.jpg')], // Fixed here
    likes: 42,
    comments: 5,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    user: { name: 'Vinter', avatar: require('../assets/images/strength.jpg') },
    text: 'Strength training day!',
    workoutDetails: { type: 'Strength Training', duration: 45 },
    images: [require('../assets/images/gym.jpg'), require('../assets/images/gym2.jpg')], // Fixed here
    likes: 35,
    comments: 3,
    timestamp: '4 hours ago',
  },
];


const PostCard = ({ post, onLike, onComment }) => {
  const [liked, setLiked] = useState(false);
  const handleLike = () => { setLiked(!liked); onLike(post.id); };
  return (
    <View style={[styles.postCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.postHeader}>
        <Image source={post.user.avatar} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{post.user.name}</Text>
          <Text style={[styles.postTime, { color: theme.colors.textSecondary }]}>{post.timestamp}</Text>
        </View>
      </View>
      {post.workoutDetails && (
        <View style={styles.workoutDetails}>
          <View style={styles.workoutDetailItem}>
            <Ionicons name="fitness-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.workoutDetailText, { color: theme.colors.text }]}>{post.workoutDetails.type}</Text>
          </View>
          <View style={styles.workoutDetailItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.workoutDetailText, { color: theme.colors.text }]}>{post.workoutDetails.duration} mins</Text>
          </View>
        </View>
      )}
      {post.text && <Text style={[styles.postText, { color: theme.colors.text }]}>{post.text}</Text>}
      {post.images.length > 0 && (
        <FlatList data={post.images} horizontal renderItem={({ item }) => <Image source={{ uri: item.uri }} style={styles.postImage} /> } keyExtractor={(_, i) => i.toString()} showsHorizontalScrollIndicator={false} />
      )}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>{post.likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>{post.comments} Comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CommunityFeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(DUMMY_POSTS);

  useEffect(() => { setFilteredPosts(posts.filter(post => post.text.toLowerCase().includes(searchQuery.toLowerCase()) || post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || (post.workoutDetails?.type?.toLowerCase().includes(searchQuery.toLowerCase())))); }, [searchQuery, posts]);

  const handleCreatePost = () => navigation.navigate('CreatePost');

  const handleLike = (postId) => console.log(`Liked post ${postId}`);
  const handleComment = (postId) => console.log(`Navigate to comments for post ${postId}`);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput style={[styles.searchInput, { color: theme.colors.text }]} placeholder="Search" placeholderTextColor={theme.colors.textSecondary} value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <TouchableOpacity style={[styles.createPostButton, { backgroundColor: theme.colors.primary }]} onPress={handleCreatePost}>
          <Ionicons name="add-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      <FlatList data={filteredPosts} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => <PostCard post={item} onLike={handleLike} onComment={handleComment} /> } ListEmptyComponent={() => <View style={styles.emptyState}><Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>No posts yet.</Text></View>} contentContainerStyle={styles.feedContainer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  createPostButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedContainer: {
    paddingBottom: 20,
  },
  postCard: {
    margin: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  postTime: {
    fontSize: 12,
  },
  workoutDetails: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  workoutDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  workoutDetailText: {
    marginLeft: 5,
    fontSize: 14,
  },
  postText: {
    marginBottom: 10,
  },
  postImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CommunityFeedScreen;