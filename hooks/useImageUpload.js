// hooks/useImageUpload.js
import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from '../utils/logger';

const API_URL = __DEV__ 
  ? 'http://192.168.100.88:3000'  // Local development
  : 'https://trainly-backend-production.up.railway.app';  // Production

const USER_DATA_KEY = '@user_data';

/**
 * Custom hook for handling image upload functionality.
 * 
 * @returns {Object} Image upload state and functions
 */
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  /**
   * Uploads an avatar image to the server.
   * 
   * @param {string} imageUri - Local URI of the image to upload
   * @returns {Promise<string>} The uploaded avatar URL
   * @throws {Error} If upload fails
   */
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

  /**
   * Picks an image from camera or gallery and uploads it.
   * 
   * @param {string} sourceType - 'camera' or 'gallery'
   * @param {Function} onSuccess - Callback with uploaded avatar URL
   * @returns {Promise<void>}
   */
  const pickImage = async (sourceType, onSuccess) => {
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
          if (onSuccess) {
            onSuccess(avatarUrl);
          }
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          Alert.alert('Error', 'Failed to update profile picture');
        }
      }
    } catch (error) {
      logError('Error picking image:', error);
      Alert.alert('Error', 'Error selecting or processing image');
    }
  };

  return {
    uploading,
    uploadAvatar,
    pickImage,
  };
};

