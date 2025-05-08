import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Replace with your actual backend URL
const API_URL = 'http://192.168.100.88:3000';

const theme = {
  colors: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    border: '#F0F0F0',
    primary: '#2196F3',
    card: '#FFFFFF',
    success: '#4CAF50',
    error: '#f44336',
  },
};

const CreateProgressPostScreen = ({ navigation }) => {
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState({ type: '', duration: '', calories: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsMultipleSelection: true, 
        quality: 0.7, 
        base64: false 
      });
      
      if (!result.canceled) {
        setSelectedImages(result.assets.slice(0, 4));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmitPost = async () => {
    // Validate post content
    if (!postText.trim() && selectedImages.length === 0) {
      Alert.alert('Validation Error', 'Please add content to your post.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get the token
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('Authentication Required', 'Please log in to create a post.');
        setIsSubmitting(false);
        return;
      }
      
      // Configure headers with token
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      // In a real app, you'd upload the images first and get URLs back
      // For now, we'll just use the first image if available
      const imageUri = selectedImages.length > 0 ? selectedImages[0].uri : null;
      
      // Create post data
      const postData = {
        content: postText.trim(),
        image: imageUri, // In a real app, this would be the uploaded image URL
        workoutDetails: workoutDetails.type ? {
          type: workoutDetails.type,
          duration: parseInt(workoutDetails.duration) || 0,
          calories: parseInt(workoutDetails.calories) || 0
        } : null
      };
      
      console.log("Sending post data:", postData);
      
      // Submit post to API
      const response = await axios.post(`${API_URL}/api/posts`, postData, config);
      
      console.log("Post creation response:", response.data);
      
      // Navigate back
      navigation.goBack();
      
      // Show success message
      Alert.alert('Success', 'Your progress has been shared!');
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      
      // Handle specific errors
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please log in again.');
      } else {
        Alert.alert('Error', 'Failed to submit post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Share Progress</Text>
        <TouchableOpacity onPress={handleSubmitPost} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={[styles.postButton, { color: theme.colors.primary }]}>
              Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={[styles.workoutDetailsContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Workout Details</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
          placeholder="Workout Type"
          placeholderTextColor={theme.colors.textSecondary}
          value={workoutDetails.type}
          onChangeText={(text) => setWorkoutDetails((prev) => ({ ...prev, type: text }))}
        />
        <View style={styles.inlineInputs}>
          <TextInput
            style={[styles.inlineInput, { backgroundColor: theme.colors.background, color: theme.colors.text, flex: 1, marginRight: 10 }]}
            placeholder="Duration (min)"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            value={workoutDetails.duration}
            onChangeText={(text) => setWorkoutDetails((prev) => ({ ...prev, duration: text }))}
          />
          <TextInput
            style={[styles.inlineInput, { backgroundColor: theme.colors.background, color: theme.colors.text, flex: 1 }]}
            placeholder="Calories"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            value={workoutDetails.calories}
            onChangeText={(text) => setWorkoutDetails((prev) => ({ ...prev, calories: text }))}
          />
        </View>
      </View>
      <TextInput
        style={[styles.postTextInput, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        multiline
        placeholder="Share your experience!"
        placeholderTextColor={theme.colors.textSecondary}
        value={postText}
        onChangeText={setPostText}
        maxLength={500}
      />
      <View style={[styles.imageUploadContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Add Photos</Text>
        <View style={styles.imagePickerRow}>
          <TouchableOpacity style={[styles.imagePickerButton, { backgroundColor: theme.colors.background }]} onPress={pickImage}>
            <Ionicons name="camera-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.imagePickerText, { color: theme.colors.primary }]}>Select Photos</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
            {selectedImages.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <View style={styles.removeImageButton}>
                  <Ionicons name="close-circle" size={22} color={theme.colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  workoutDetailsContainer: {
    margin: 15,
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  inlineInputs: {
    flexDirection: 'row',
  },
  inlineInput: {
    padding: 12,
    borderRadius: 8,
  },
  postTextInput: {
    margin: 15,
    borderRadius: 12,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageUploadContainer: {
    margin: 15,
    borderRadius: 12,
    padding: 15,
  },
  imagePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  imagePickerText: {
    marginLeft: 5,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});

export default CreateProgressPostScreen;