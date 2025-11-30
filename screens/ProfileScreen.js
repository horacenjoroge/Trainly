// screens/ProfileScreen.js - Redesigned
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/api';
import { log, logError, logWarn } from '../utils/logger';

const API_URL = __DEV__ 
  ? 'http://192.168.100.88:3000'  // Local development
  : 'https://trainly-backend-production.up.railway.app';  // Production
const USER_DATA_KEY = '@user_data';
const { width } = Dimensions.get('window');

// Helper function to safely handle image URIs
const getSafeImageUri = (imageSource) => {
  // If it's already a require statement (local image), return as is
  if (typeof imageSource !== 'string') {
    return imageSource;
  }
  
  // Handle null, undefined or empty string
  if (!imageSource) {
    return require('../assets/images/bike.jpg');
  }
  
  // Handle server paths that start with /uploads/
  if (imageSource.startsWith('/uploads/')) {
    return { uri: `${API_URL}${imageSource}` };
  }
  
  // Handle full URLs
  if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
    return { uri: imageSource };
  }
  
  // Fallback to default image
  return require('../assets/images/bike.jpg');
};

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [userData, setUserData] = useState({
    name: 'User',
    bio: 'Fitness enthusiast',
    stats: { workouts: 0, hours: 0, calories: 0 },
    followers: 0,
    following: 0
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Add a listener for focus events to refresh data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProfileData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadProfileData();
    loadRecentWorkouts();
    global.getSafeImageUri = getSafeImageUri;
  }, []);

  const loadRecentWorkouts = async () => {
    try {
      // Load recent workouts from AsyncStorage
      const workoutHistory = await AsyncStorage.getItem('workoutHistory');
      if (workoutHistory) {
        const workouts = JSON.parse(workoutHistory);
        // Get the 3 most recent workouts
        setRecentWorkouts(workouts.slice(0, 3));
      }
    } catch (error) {
      logError('Error loading recent workouts:', error);
    }
  };

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Load current user ID first
      try {
        const userDataFromStorage = await AsyncStorage.getItem('userData');
        if (userDataFromStorage) {
          const parsedUserData = JSON.parse(userDataFromStorage);
          const userId = parsedUserData._id || parsedUserData.id;
          setCurrentUserId(userId);
          log('✅ ProfileScreen: Loaded current user ID:', userId);
        }
      } catch (error) {
        logError('❌ ProfileScreen: Error loading user ID:', error);
      }
      
      // Try to get profile data from API
      try {
        const profileData = await userService.getUserProfile();
        log('Profile data loaded:', profileData);
        
        // Get followers and following counts
        const followersData = await userService.getFollowers();
        const followingData = await userService.getFollowing();
        
        const followersCount = followersData?.length || 0;
        const followingCount = followingData?.length || 0;
        
        // Load additional data from AsyncStorage for bio
        const cachedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
        let dynamicBio = 'Fitness enthusiast'; // Default bio
        
        if (cachedUserData) {
          const parsedData = JSON.parse(cachedUserData);
          // Use the saved bio if it exists, otherwise keep the default
          if (parsedData.bio) {
            dynamicBio = parsedData.bio;
          }
        }
        
        // Update user data
        setUserData({
          name: profileData.name || 'User',
          bio: profileData.bio || dynamicBio, // Use API bio or dynamic bio
          stats: {
            workouts: profileData.stats?.workouts || 0,
            hours: profileData.stats?.hours || 0,
            calories: profileData.stats?.calories || 0
          },
          followers: followersCount,
          following: followingCount
        });
        
        // Set profile image if available
        if (profileData.avatar) {
          setProfileImage(profileData.avatar);
        }
      } catch (apiError) {
        logError('Error fetching profile from API:', apiError);
        
        // Try to load cached data as fallback
        const cachedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
        if (cachedUserData) {
          const parsedData = JSON.parse(cachedUserData);
          setUserData({
            name: parsedData.fullName || parsedData.name || 'User',
            bio: parsedData.bio || 'Fitness enthusiast', // Use dynamic bio from cache
            stats: parsedData.stats || { workouts: 0, hours: 0, calories: 0 },
            followers: parsedData.followers || 0,
            following: parsedData.following || 0
          });
          
          if (parsedData.avatar) {
            setProfileImage(parsedData.avatar);
          }
        }
      }
    } catch (error) {
      logError('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Upload image to the server
  const uploadAvatar = async (imageUri) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      });

      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/uploads/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update local storage with new avatar
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userData) {
        const parsedData = JSON.parse(userData);
        parsedData.avatar = data.avatar;
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(parsedData));
      }
      
      return data.avatar;
    } catch (error) {
      logError('Error uploading avatar:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async (sourceType) => {
    try {
      // Request permissions
      let permissionResult;
      if (sourceType === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission Required', `Please grant ${sourceType} permissions to continue`);
        return;
      }

      // Launch camera or image picker
      const options = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      const result = sourceType === 'camera' 
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync({
            ...options,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });

      // Process selected image
      if (!result.canceled && result.assets && result.assets[0]) {
        try {
          const avatarUrl = await uploadAvatar(result.assets[0].uri);
          setProfileImage(avatarUrl);
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          Alert.alert('Error', 'Failed to update profile picture');
        }
      }
    } catch (error) {
      logError('Error picking image:', error);
      Alert.alert('Error', 'Error selecting or processing image');
    } finally {
      setModalVisible(false);
    }
  };

  // Format workout duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  // Get workout icon
  const getWorkoutIcon = (type) => {
    const icons = {
      'Swimming': 'water-outline',
      'Running': 'walk-outline',
      'Cycling': 'bicycle-outline',
      'Gym': 'barbell-outline',
    };
    return icons[type] || 'fitness-outline';
  };

  // Stat item component
  const StatItem = ({ label, value, onPress }) => (
    <TouchableOpacity 
      style={styles.statItem}
      onPress={onPress}
    >
      <Text style={[styles.statValue, { color: theme.colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Recent Workout Item Component
  const RecentWorkoutItem = ({ workout }) => (
    <TouchableOpacity 
      style={[styles.workoutItem, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border 
      }]}
      onPress={() => navigation.navigate('WorkoutDetail', { workout })}
    >
      <View style={[styles.workoutIcon, { backgroundColor: theme.colors.primary + '15' }]}>
        <Ionicons 
          name={getWorkoutIcon(workout.type)} 
          size={20} 
          color={theme.colors.primary} 
        />
      </View>
      <View style={styles.workoutInfo}>
        <Text style={[styles.workoutType, { color: theme.colors.text }]}>
          {workout.type}
        </Text>
        <Text style={[styles.workoutDetails, { color: theme.colors.textSecondary }]}>
          {formatDuration(workout.duration)} • {workout.calories || 0} cal
        </Text>
      </View>
      <Text style={[styles.workoutDate, { color: theme.colors.textSecondary }]}>
        {new Date(workout.date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Profile
          </Text>
        </View>
        
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={getSafeImageUri(profileImage)}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(true)}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {userData.name}
          </Text>
          
          <Text style={[styles.userBio, { color: theme.colors.textSecondary }]}>
            {userData.bio}
          </Text>
        </View>
        
        {/* Stats */}
        <View style={[styles.statsContainer, { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }]}>
          <StatItem 
            label="Workouts" 
            value={userData.stats.workouts} 
            onPress={() => navigation.navigate('WorkoutHistory')}
          />
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          
          <StatItem 
            label="Followers" 
            value={userData.followers} 
            onPress={() => {
              if (currentUserId) {
                navigation.navigate('FollowersList', { userId: currentUserId });
              } else {
                logWarn('No current user ID available for followers navigation');
              }
            }}
          />
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          
          <StatItem 
            label="Following" 
            value={userData.following} 
            onPress={() => {
              if (currentUserId) {
                navigation.navigate('FollowingList', { userId: currentUserId });
              } else {
                logWarn('No current user ID available for following navigation');
              }
            }}
          />
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          
          <StatItem 
            label="Calories" 
            value={userData.stats.calories} 
          />
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('TrainingStack')}
          >
            <Ionicons name="fitness-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Start Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton, { 
              borderColor: theme.colors.primary,
            }]}
            onPress={() => navigation.navigate('PersonalInfo')}
          >
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('WorkoutHistory')}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentWorkouts.length > 0 ? (
            <View style={styles.recentWorkouts}>
              {recentWorkouts.map((workout, index) => (
                <RecentWorkoutItem key={workout.id || index} workout={workout} />
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border 
            }]}>
              <Ionicons 
                name="fitness-outline" 
                size={48} 
                color={theme.colors.textSecondary} 
              />
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                No workouts yet
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
                Start your first workout to see it here
              </Text>
              <TouchableOpacity 
                style={[styles.emptyStateButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('TrainingStack')}
              >
                <Text style={styles.emptyStateButtonText}>Start Training</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Quick Access Menu */}
        <View style={styles.menuContainer}>
          <Text style={[styles.menuSectionTitle, { color: theme.colors.text }]}>
            Quick Access
          </Text>
          
          {/* Workout History */}
          <TouchableOpacity 
            style={[styles.menuItem, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border 
            }]}
            onPress={() => navigation.navigate('WorkoutHistory')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.menuText, { color: theme.colors.text }]}>Workout History</Text>
                <Text style={[styles.menuSubtext, { color: theme.colors.textSecondary }]}>
                  View all your past workouts
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {/* Find Friends */}
          <TouchableOpacity 
            style={[styles.menuItem, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border 
            }]}
            onPress={() => navigation.navigate('FindFriends')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="people-outline" size={20} color="#10B981" />
              </View>
              <View>
                <Text style={[styles.menuText, { color: theme.colors.text }]}>Find Friends</Text>
                <Text style={[styles.menuSubtext, { color: theme.colors.textSecondary }]}>
                  Connect with other fitness enthusiasts
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Image picker modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Update Profile Photo</Text>
            
            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomColor: theme.colors.border }]} 
              onPress={() => pickImage('camera')}
            >
              <Ionicons name="camera-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomColor: theme.colors.border }]} 
              onPress={() => pickImage('gallery')}
            >
              <Ionicons name="images-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.cancelText, { color: theme.colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editProfileBtn: {
    // Removed - no longer needed
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
  },
  statsContainer: {
    flexDirection: 'row',
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flex: 1,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  actionButtonText: {
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentWorkouts: {
    gap: 12,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  workoutDetails: {
    fontSize: 14,
  },
  workoutDate: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  menuContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 16,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});