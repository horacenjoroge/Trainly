// ProfileScreen with improved avatar upload using the new upload service
import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/api';

const PROFILE_IMAGE_KEY = '@profile_image';
const USER_DATA_KEY = '@user_data';
const API_URL = 'http://192.168.100.88:3000'; // Base URL without /api

const ProfileOption = ({ icon, title, subtitle, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.option, { borderBottomColor: theme.colors.border }]} 
      onPress={onPress}
    >
      <Ionicons name={icon} size={24} color={theme.colors.primary} />
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.optionSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
};

// Helper function to safely handle image URIs
const getSafeImageUri = (imageSource) => {
  console.log('Getting image for source:', imageSource);
  
  // If it's already a require statement (local image), return as is
  if (typeof imageSource !== 'string') {
    return imageSource;
  }
  
  // Handle null, undefined or empty string
  if (!imageSource) {
    console.log('Empty image source, using fallback');
    return require('../assets/images/bike.jpg');
  }
  
  // Handle default avatar
  if (imageSource === 'default-avatar-url') {
    console.log('Default avatar URL detected, using fallback');
    return require('../assets/images/bike.jpg');
  }
  
  // Handle server paths that start with /uploads/
  if (imageSource.startsWith('/uploads/')) {
    const fullUri = `${API_URL}${imageSource}`;
    console.log('Server image path detected:', fullUri);
    return { uri: fullUri };
  }
  
  // Handle full URLs
  if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
    console.log('Full URL detected:', imageSource);
    return { uri: imageSource };
  }
  
  // Handle file:/// URLs by using a fallback
  if (imageSource.startsWith('file:///')) {
    console.log('Local file URI detected, using fallback image');
    return require('../assets/images/bike.jpg');
  }
  
  // Fallback to default image for any other case
  console.log('Unknown image format, using fallback');
  return require('../assets/images/bike.jpg');
};

export default function ProfileScreen({ navigation, route }) {
  const theme = useTheme();
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    bio: 'Fitness enthusiast | Runner',
    stats: {
      workouts: 0,
      hours: 0,
      calories: 0
    },
    followers: 0,
    following: 0
  });
  
  // Default achievements (we'll replace with API data if available)
  const [achievements] = useState(['🏃‍♂️', '🏋️‍♂️', '🎯', '🔥', '⚡️']);

  // Add a listener for focus events to refresh data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileData();
      
      // Also check if we need to update from local storage (for name changes)
      checkUserDataUpdates();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadProfileData();
    
    // Make getSafeImageUri available globally
    global.getSafeImageUri = getSafeImageUri;
  }, []);
  
  // Function to check if userData has been updated in AsyncStorage
  const checkUserDataUpdates = async () => {
    try {
      const savedData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Update the user data if name has changed in local storage
        if (parsedData.fullName && parsedData.fullName !== userData.name) {
          setUserData(prevData => ({
            ...prevData,
            name: parsedData.fullName
          }));
        }
      }
    } catch (error) {
      console.error('Error checking user data updates:', error);
    }
  };

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Get profile data from backend using your existing service
      const profileData = await userService.getUserProfile();
      console.log('Profile data loaded:', profileData);
      
      // Get followers and following counts
      let followersCount = 0;
      let followingCount = 0;
      
      try {
        const followersData = await userService.getFollowers();
        const followingData = await userService.getFollowing();
        
        followersCount = followersData?.length || 0;
        followingCount = followingData?.length || 0;
      } catch (error) {
        console.error('Error fetching followers/following:', error);
      }
      
      // Get user data from AsyncStorage for any fields not in API
      try {
        const cachedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
        if (cachedUserData) {
          const parsedData = JSON.parse(cachedUserData);
          
          // Set user data combining API response and cached data
          // Use cached fullName if available (from PersonalInfoScreen)
          setUserData({
            name: parsedData.fullName || profileData.name || 'User',
            bio: profileData.bio || 'Fitness enthusiast | Runner',
            stats: {
              workouts: profileData.stats?.workouts || 0,
              hours: profileData.stats?.hours || 0,
              calories: profileData.stats?.calories || 0
            },
            followers: followersCount,
            following: followingCount
          });
        } else {
          // No cached data, use API data only
          setUserData({
            name: profileData.name || 'User',
            bio: profileData.bio || 'Fitness enthusiast | Runner',
            stats: {
              workouts: profileData.stats?.workouts || 0,
              hours: profileData.stats?.hours || 0,
              calories: profileData.stats?.calories || 0
            },
            followers: followersCount,
            following: followingCount
          });
        }
      } catch (error) {
        // Fallback to API data only
        setUserData({
          name: profileData.name || 'User',
          bio: profileData.bio || 'Fitness enthusiast | Runner',
          stats: {
            workouts: profileData.stats?.workouts || 0,
            hours: profileData.stats?.hours || 0,
            calories: profileData.stats?.calories || 0
          },
          followers: followersCount,
          following: followingCount
        });
      }
      
      // Set profile image if available from backend
      if (profileData.avatar) {
        console.log('Setting profile image from API:', profileData.avatar);
        setProfileImage(profileData.avatar);
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      
      // Try to load cached data as fallback
      try {
        const cachedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
        if (cachedUserData) {
          const userData = JSON.parse(cachedUserData);
          setUserData({
            name: userData.fullName || 'User',
            bio: userData.bio || 'Fitness enthusiast | Runner',
            stats: userData.stats || { workouts: 0, hours: 0, calories: 0 },
            followers: userData.followers || 0,
            following: userData.following || 0
          });
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Upload image to the server using the new upload endpoint
  const uploadAvatar = async (imageUri) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      
      // Get filename from uri
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      // Append image to form data
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      });

      const token = await AsyncStorage.getItem('token');

      // Upload to the new endpoint
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
      return data.avatar; // Return the server URL to the uploaded avatar
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async (sourceType) => {
    try {
      let permissionResult;
      if (sourceType === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (permissionResult.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          `Please grant ${sourceType} permissions to continue`,
          [{ text: 'OK' }]
        );
        return;
      }

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

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImageUri = result.assets[0].uri;
        
        try {
          // Upload to server using the new endpoint
          const avatarUrl = await uploadAvatar(selectedImageUri);
          
          // Update local state with the server URL
          setProfileImage(avatarUrl);
          
          // Update user data in storage if needed
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsedData = JSON.parse(userData);
            parsedData.avatar = avatarUrl;
            await AsyncStorage.setItem('userData', JSON.stringify(parsedData));
          }
          
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          console.error('Error updating profile picture:', error);
          Alert.alert('Error', 'Failed to update profile picture');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Error selecting or processing image');
    } finally {
      setModalVisible(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 10, color: theme.colors.text }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={getSafeImageUri(profileImage)}
              style={styles.profileImage}
              onLoadStart={() => console.log('Loading profile image:', profileImage)}
              onLoad={() => console.log('Profile image loaded successfully')}
              onError={(e) => {
                console.log('Profile image error details:', {
                  source: profileImage,
                  error: e.nativeEvent.error
                });
                // Fallback to local image on error
                if (profileImage.startsWith('/uploads/')) {
                  console.log('Server image failed, using local fallback');
                  setProfileImage(null); // This will trigger the fallback in getSafeImageUri
                }
              }}
            />
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(true)}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={[styles.name, { color: theme.colors.text }]}>{userData.name}</Text>
          <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
            {userData.bio}
          </Text>
        </View>

        <View style={[styles.statsRow, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity 
            style={styles.stat}
            onPress={() => {/* Navigate to workouts history */}}
          >
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.stats.workouts}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Workouts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.stat, styles.statBorder, { borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('FollowersList')}
          >
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.followers}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Followers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.stat, styles.statBorder, { borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('FollowingList')}
          >
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.following}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Following</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.stat}
          >
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.stats.calories || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Calories</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {achievements.map((emoji, index) => (
              <View key={index} style={[styles.achievement, { backgroundColor: theme.colors.border }]}>
                <Text style={styles.achievementEmoji}>{emoji}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account Settings</Text>
          <ProfileOption
            icon="person-outline"
            title="Personal Information"
            subtitle="Update your profile details"
            onPress={() => navigation.navigate('PersonalInfo')}
          />
          <ProfileOption
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your alerts"
          />
          <ProfileOption
            icon="lock-closed-outline"
            title="Privacy"
            subtitle="Control your privacy settings"
          />
          <ProfileOption
            icon="settings-outline"
            title="Preferences"
            subtitle="App settings and more"
          />
          <ProfileOption
            icon="alert-circle-outline"
            title="Emergency Services"
            subtitle="Set up emergency contacts and alerts"
            onPress={() => navigation.navigate('EmergencyStack', { 
              screen: 'EmergencyServices' 
            })}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Social</Text>
          <ProfileOption
            icon="people-outline"
            title="Find Friends"
            subtitle="Connect with other fitness enthusiasts"
            onPress={() => navigation.navigate('FindFriends')}
          />
          <ProfileOption
            icon="share-social-outline"
            title="Share Profile"
            subtitle="Let others see your progress"
          />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Change Profile Photo</Text>
            
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => pickImage('camera')}
            >
              <Ionicons name="camera-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => pickImage('gallery')}
            >
              <Ionicons name="images-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, styles.cancelOption]} 
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
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#E57C0B',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#120B42',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bio: {
    fontSize: 16,
    marginTop: 5,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E57C0B20',
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
    borderColor: '#E57C0B20',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  achievement: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#E57C0B',
  },
  achievementEmoji: {
    fontSize: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionSubtitle: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  cancelOption: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 124, 11, 0.2)',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
});