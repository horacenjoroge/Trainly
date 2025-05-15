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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/api';

const PROFILE_IMAGE_KEY = '@profile_image';
const API_URL = 'http://192.168.100.88:3000/api'; // Same as in your api.js

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

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadProfileData();
    loadCachedImage();
  }, []);

  const loadCachedImage = async () => {
    try {
      const cachedImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
      if (cachedImage) {
        setProfileImage(cachedImage);
      }
    } catch (error) {
      console.error('Error loading cached image:', error);
    }
  };

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Get profile data from backend using your existing service
      const profileData = await userService.getUserProfile();
      
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
      
      // Get user data from AsyncStorage as fallback
      const cachedUserData = await AsyncStorage.getItem('userData');
      const userData = cachedUserData ? JSON.parse(cachedUserData) : {};
      
      // Set user data combining API response and cached data
      setUserData({
        name: profileData.name || userData.name || 'User',
        bio: profileData.bio || 'Fitness enthusiast | Runner',
        stats: {
          workouts: profileData.stats?.workouts || 0,
          hours: profileData.stats?.hours || 0,
          calories: profileData.stats?.calories || 0
        },
        followers: followersCount,
        following: followingCount
      });
      
      // Set profile image if available from backend
      if (profileData.avatar) {
        const imageUrl = profileData.avatar.startsWith('http') 
          ? profileData.avatar 
          : `${API_URL}${profileData.avatar}`;
        
        setProfileImage(imageUrl);
        await AsyncStorage.setItem(PROFILE_IMAGE_KEY, imageUrl);
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      
      // Try to load cached data as fallback
      try {
        const cachedUserData = await AsyncStorage.getItem('userData');
        if (cachedUserData) {
          const userData = JSON.parse(cachedUserData);
          setUserData({
            name: userData.name || 'User',
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

  const updateProfileStats = async (workouts) => {
    try {
      // Example: Update workout count after completing a workout
      await userService.updateUserStats({ workouts });
      
      // Update local state
      setUserData(prevData => ({
        ...prevData,
        stats: {
          ...prevData.stats,
          workouts
        }
      }));
    } catch (error) {
      console.error('Error updating stats:', error);
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
        quality: 1,
      };

      const result = sourceType === 'camera' 
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync({
            ...options,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });

      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        
        // Show loading state
        setLoading(true);
        
        try {
          // Update profile with new avatar
          await userService.updateUserProfile({ avatar: selectedImageUri });
          
          // Update UI
          setProfileImage(selectedImageUri);
          await AsyncStorage.setItem(PROFILE_IMAGE_KEY, selectedImageUri);
          
        } catch (error) {
          console.error('Error uploading image:', error);
          
          // Use local image as fallback even if server update fails
          setProfileImage(selectedImageUri);
          await AsyncStorage.setItem(PROFILE_IMAGE_KEY, selectedImageUri);
        } finally {
          setLoading(false);
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
              source={{ uri: global.getSafeImageUri(profileImage) }}
              style={styles.profileImage}
              onError={() => {
                // Fallback to placeholder on error
                setProfileImage('https://via.placeholder.com/150');
              }}
            />
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="camera" size={20} color="#fff" />
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