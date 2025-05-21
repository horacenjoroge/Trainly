// screens/ProfileScreen.js
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

const API_URL = 'http://192.168.100.88:3000'; 
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
  const [userData, setUserData] = useState({
    name: 'User',
    bio: 'Fitness enthusiast',
    stats: { workouts: 0, hours: 0, calories: 0 },
    followers: 0,
    following: 0
  });
  
  // Add a listener for focus events to refresh data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProfileData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadProfileData();
    global.getSafeImageUri = getSafeImageUri;
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Try to get profile data from API
      try {
        const profileData = await userService.getUserProfile();
        console.log('Profile data loaded:', profileData);
        
        // Get followers and following counts
        const followersData = await userService.getFollowers();
        const followingData = await userService.getFollowing();
        
        const followersCount = followersData?.length || 0;
        const followingCount = followingData?.length || 0;
        
        // Update user data
        setUserData({
          name: profileData.name || 'User',
          bio: profileData.bio || 'Fitness enthusiast',
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
        console.error('Error fetching profile from API:', apiError);
        
        // Try to load cached data as fallback
        const cachedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
        if (cachedUserData) {
          const parsedData = JSON.parse(cachedUserData);
          setUserData({
            name: parsedData.fullName || parsedData.name || 'User',
            bio: parsedData.bio || 'Fitness enthusiast',
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
      console.error('Error loading profile:', error);
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
      console.error('Error uploading avatar:', error);
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
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Error selecting or processing image');
    } finally {
      setModalVisible(false);
    }
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
          <TouchableOpacity 
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('PersonalInfo')}
          >
            <Ionicons name="pencil-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.editText, { color: theme.colors.primary }]}>Edit</Text>
          </TouchableOpacity>
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
          />
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          
          <StatItem 
            label="Followers" 
            value={userData.followers} 
            onPress={() => navigation.navigate('FollowersList')}
          />
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          
          <StatItem 
            label="Following" 
            value={userData.following} 
            onPress={() => navigation.navigate('FollowingList')}
          />
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          
          <StatItem 
            label="Calories" 
            value={userData.stats.calories} 
          />
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('TrainingStack')}
          >
            <Ionicons name="fitness-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Start Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { 
              backgroundColor: 'transparent',
              borderColor: theme.colors.primary,
              borderWidth: 1
            }]}
            onPress={() => navigation.navigate('FindFriends')}
          >
            <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Find Friends</Text>
          </TouchableOpacity>
        </View>
        
        {/* Menu Options */}
        <View style={styles.menuContainer}>
          {/* Profile Settings */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('SettingsStack')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          {/* Emergency Services */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('EmergencyStack')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#EB445A20' }]}>
                <Ionicons name="alert-circle-outline" size={20} color="#EB445A" />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Emergency Services</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          {/* Help & Support */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#4A90E220' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#4A90E2" />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    marginLeft: 4,
    fontWeight: '500',
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
    padding: 12,
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
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '48%',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  menuContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
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