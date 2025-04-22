import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Color Palette
const colors = {
  background: '#120B42',
  primary: '#E57C0B',
  surface: '#1A144B',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#4A90E2',
};

// Post Component
const PostCard = ({ user, content, image, likes, comments }) => {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image 
          source={user.avatar} 
          style={styles.userAvatar} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.postTime}>2 hours ago</Text>
        </View>
      </View>
      
      {content && <Text style={styles.postContent}>{content}</Text>}
      
      {image && (
        <Image 
          source={image} 
          style={styles.postImage} 
          resizeMode="cover" 
        />
      )}
      
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setLiked(!liked)}
        >
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={20} 
            color={liked ? colors.primary : colors.textSecondary} 
          />
          <Text style={styles.actionText}>{likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{comments} Comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Personal Progress Card
const ProgressCard = ({ workouts, hours, calories }) => {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>My Progress</Text>
        <TouchableOpacity>
          <Text style={styles.progressEdit}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressStats}>
        <View style={styles.progressStatItem}>
          <Ionicons name="trophy-outline" size={24} color={colors.primary} />
          <Text style={styles.progressStatValue}>{workouts}</Text>
          <Text style={styles.progressStatLabel}>Workouts</Text>
        </View>
        <View style={styles.progressStatItem}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text style={styles.progressStatValue}>{hours}</Text>
          <Text style={styles.progressStatLabel}>Hours</Text>
        </View>
        <View style={styles.progressStatItem}>
          <Ionicons name="flame-outline" size={24} color={colors.primary} />
          <Text style={styles.progressStatValue}>{calories}</Text>
          <Text style={styles.progressStatLabel}>Calories</Text>
        </View>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([
    {
      id: '1',
      user: {
        name: 'Marion',
        avatar: require('../assets/images/run.jpg')
      },
      content: 'Just completed my first marathon! Feeling incredibly proud and exhausted!',
      image: require('../assets/images/run.jpg'),
      likes: 156,
      comments: 24
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
      comments: 12
    }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor={colors.background} 
        barStyle="light-content" 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Welcome back, Horace!</Text>
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

      <ScrollView>
        {/* Progress Card */}
        <ProgressCard 
          workouts={12} 
          hours={5.2} 
          calories={324} 
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
          <FlatList 
            data={posts}
            renderItem={({ item }) => (
              <PostCard 
                user={item.user}
                content={item.content}
                image={item.image}
                likes={item.likes}
                comments={item.comments}
              />
            )}
            keyExtractor={item => item.id}
            horizontal={false}
          />
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
});

export default HomeScreen;