// components/profile/ProfileHeader.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getSafeImageUri } from '../../utils/imageUtils';

/**
 * ProfileHeader component - Displays user avatar, name, and bio with image upload capability.
 * 
 * @param {Object} props
 * @param {string} props.profileImage - URL or path to the profile image
 * @param {string} props.userName - User's display name
 * @param {string} props.userBio - User's bio text
 * @param {Function} props.onImagePress - Callback when camera button is pressed
 * @param {boolean} props.uploading - Whether image is currently uploading
 * @returns {JSX.Element} The rendered ProfileHeader component
 */
const ProfileHeader = React.memo(({ profileImage, userName, userBio, onImagePress, uploading }) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.profileInfo}>
      <View style={styles.profileImageWrapper}>
        <Image
          source={getSafeImageUri(profileImage)}
          style={styles.profileImage}
        />
        <TouchableOpacity 
          style={[styles.cameraButton, { backgroundColor: colors.primary }]}
          onPress={onImagePress}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera" size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.userName, { color: colors.text }]}>
        {userName}
      </Text>
      
      <Text style={[styles.userBio, { color: colors.textSecondary }]}>
        {userBio}
      </Text>
    </View>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

const styles = StyleSheet.create({
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ProfileHeader;

