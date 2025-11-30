import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { log, logError } from '../utils/logger';

const USER_DATA_KEY = '@user_data';

// Validation rules
const validationRules = {
  fullName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Full name must contain only letters and spaces, minimum 2 characters'
  },
  username: {
    required: true,
    minLength: 3,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Username must contain only letters, numbers, and underscores, minimum 3 characters'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: false,
    pattern: /^[\+]?[0-9\s\-\(\)]+$/,
    minLength: 10,
    message: 'Please enter a valid phone number (minimum 10 digits)'
  },
  dateOfBirth: {
    required: false,
    pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/,
    message: 'Please enter date in DD/MM/YYYY format'
  },
  gender: {
    required: false,
    pattern: /^(male|female|other)$/i,
    message: 'Gender must be Male, Female, or Other'
  },
  height: {
    required: false,
    pattern: /^[0-9]+$/,
    min: 100,
    max: 250,
    message: 'Height must be between 100-250 cm'
  },
  weight: {
    required: false,
    pattern: /^[0-9]+(\.[0-9]+)?$/,
    min: 30,
    max: 300,
    message: 'Weight must be between 30-300 kg'
  },
  fitnessLevel: {
    required: false,
    pattern: /^(beginner|intermediate|advanced)$/i,
    message: 'Fitness level must be Beginner, Intermediate, or Advanced'
  },
  bio: {
    required: false,
    maxLength: 150,
    message: 'Bio must be less than 150 characters'
  },
};

export default function PersonalInfoScreen({ navigation, route }) {
  const { returnTo, userId } = route?.params || {};
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [formState, setFormState] = useState({
    fullName: { value: '', label: 'Full Name', keyboardType: 'default', placeholder: 'Enter your full name' },
    username: { value: '', label: 'Username', keyboardType: 'default', placeholder: 'Choose a username' },
    email: { value: '', label: 'Email', keyboardType: 'email-address', placeholder: 'your@email.com' },
    phone: { value: '', label: 'Phone Number', keyboardType: 'phone-pad', placeholder: '+1234567890' },
    dateOfBirth: { value: '', label: 'Date of Birth', keyboardType: 'default', placeholder: 'DD/MM/YYYY' },
    gender: { value: '', label: 'Gender', keyboardType: 'default', placeholder: 'Male, Female, or Other' },
    height: { value: '', label: 'Height (cm)', keyboardType: 'numeric', placeholder: '170' },
    weight: { value: '', label: 'Weight (kg)', keyboardType: 'numeric', placeholder: '70' },
    fitnessLevel: { value: '', label: 'Fitness Level', keyboardType: 'default', placeholder: 'Beginner, Intermediate, or Advanced' },
    bio: { value: '', label: 'Bio', keyboardType: 'default', placeholder: 'Tell us about yourself...' },
  });

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  useEffect(() => {
    if (!isEditing) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isEditing]);

  // Validation function
  const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    // Check if required field is empty
    if (rules.required && (!value || value.trim() === '')) {
      return `${formState[fieldName].label} is required`;
    }

    // Skip validation for optional empty fields
    if (!rules.required && (!value || value.trim() === '')) {
      return null;
    }

    // Trim the value for validation
    const trimmedValue = value.trim();

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(trimmedValue)) {
      return rules.message;
    }

    // Length validation
    if (rules.minLength && trimmedValue.length < rules.minLength) {
      return rules.message;
    }

    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      return rules.message;
    }

    // Numeric range validation
    if (rules.min !== undefined || rules.max !== undefined) {
      const numValue = parseFloat(trimmedValue);
      if (isNaN(numValue)) {
        return rules.message;
      }
      if (rules.min !== undefined && numValue < rules.min) {
        return rules.message;
      }
      if (rules.max !== undefined && numValue > rules.max) {
        return rules.message;
      }
    }

    return null;
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(formState).forEach(fieldName => {
      const error = validateField(fieldName, formState[fieldName].value);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  // Generate dynamic bio
  const generateBio = (data) => {
    // If user has entered a custom bio, use that
    if (data.bio && data.bio.trim() !== '') {
      return data.bio.trim();
    }

    // Otherwise generate one from other fields
    const parts = [];
    
    if (data.fitnessLevel && data.fitnessLevel.trim() !== '') {
      parts.push(`${data.fitnessLevel} fitness enthusiast`);
    } else {
      parts.push('Fitness enthusiast');
    }
    
    if (data.height && data.weight) {
      const heightM = parseFloat(data.height) / 100;
      const bmi = (parseFloat(data.weight) / (heightM * heightM)).toFixed(1);
      parts.push(`BMI: ${bmi}`);
    }
    
    if (data.gender && data.gender.trim() !== '') {
      // Add some personality based on other fields
      if (data.fitnessLevel && data.fitnessLevel.toLowerCase() === 'advanced') {
        parts.push('Dedicated to peak performance');
      } else if (data.fitnessLevel && data.fitnessLevel.toLowerCase() === 'beginner') {
        parts.push('Starting my fitness journey');
      }
    }

    return parts.join(' • ');
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      log('Loading user data from storage...');

      // Step 1: Load data from AsyncStorage
      let localFormState = { ...formState };
      const savedData = await AsyncStorage.getItem(USER_DATA_KEY);
      log('Retrieved data from storage:', savedData);

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          log('Parsed data:', parsedData);

          Object.keys(localFormState).forEach((key) => {
            if (parsedData[key]) {
              localFormState[key] = {
                ...localFormState[key],
                value: parsedData[key],
              };
            }
          });
          log('Local form state after AsyncStorage:', localFormState);
        } catch (parseError) {
          logError('Error parsing saved data:', parseError);
        }
      }

      // Step 2: Load data from API and merge with local data
      try {
        const profileData = await userService.getUserProfile();
        console.log('API response from GET /users/profile:', profileData);

        if (profileData) {
          const updatedFormState = { ...localFormState };
          if (profileData.name) {
            updatedFormState.fullName = {
              ...updatedFormState.fullName,
              value: profileData.name,
            };
          }
          if (profileData.email) {
            updatedFormState.email = {
              ...updatedFormState.email,
              value: profileData.email,
            };
          }
          setFormState(updatedFormState);
        } else {
          setFormState(localFormState);
        }
      } catch (apiError) {
        console.log('Error fetching from API (using local data only):', apiError);
        setFormState(localFormState);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setFormState({ ...formState });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormState((oldState) => ({
      ...oldState,
      [field]: { ...oldState[field], value },
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const saveUserData = async () => {
    try {
      // Validate all fields first
      if (!validateAllFields()) {
        Alert.alert('Validation Error', 'Please fix the errors before saving.');
        return;
      }

      setIsSaving(true);
      Keyboard.dismiss();

      const dataToSave = Object.entries(formState).reduce((obj, [key, field]) => {
        obj[key] = field.value;
        return obj;
      }, {});

      // Generate dynamic bio only if user hasn't entered a custom bio
      let finalBio;
      if (dataToSave.bio && dataToSave.bio.trim() !== '') {
        finalBio = dataToSave.bio.trim();
      } else {
        finalBio = generateBio(dataToSave);
      }
      
      dataToSave.bio = finalBio;

      console.log('Saving data to AsyncStorage:', JSON.stringify(dataToSave));
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(dataToSave));

      // Save individual fields as backup
      for (const [key, value] of Object.entries(dataToSave)) {
        if (value && value.trim() !== '') {
          await AsyncStorage.setItem(`@user_${key}`, value);
        }
      }

      // Update API with bio
      try {
        await userService.updateUserProfile({
          name: formState.fullName.value,
          bio: finalBio,
        });
        console.log('Profile updated on API with bio:', finalBio);
      } catch (apiError) {
        console.error('Error updating profile on API:', apiError);
      }

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to the correct screen
            if (returnTo === 'UserProfile' && userId) {
              navigation.navigate('UserProfile', { userId });
            } else {
              navigation.goBack();
            }
          }
        }
      ]);
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save profile updates');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = () => {
    Keyboard.dismiss();
    setIsEditing(false);
    setErrors({});
    
    // Navigate back to the correct screen
    if (returnTo === 'UserProfile' && userId) {
      navigation.navigate('UserProfile', { userId });
    } else {
      loadUserData();
    }
  };

  const getVisibleFields = () => {
    return Object.entries(formState).filter(([key, field]) => field.value);
  };

  const getIconForField = (fieldName) => {
    const iconMap = {
      fullName: 'person-outline',
      username: 'at-outline',
      email: 'mail-outline',
      phone: 'call-outline',
      dateOfBirth: 'calendar-outline',
      gender: 'male-female-outline',
      height: 'resize-outline',
      weight: 'barbell-outline',
      fitnessLevel: 'fitness-outline',
      bio: 'document-text-outline',
    };
    return iconMap[fieldName] || 'information-circle-outline';
  };

  const renderViewMode = () => {
    const visibleFields = getVisibleFields();

    if (visibleFields.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="person-circle-outline"
            size={64}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No personal information yet
          </Text>
          <Text
            style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}
          >
            Tap the edit button to add your details
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.viewContainer}>
        {visibleFields.map(([key, field], index) => (
          <Animated.View
            key={key}
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.infoIcon}>
              <Ionicons
                name={getIconForField(key)}
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                {field.label}
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {field.value}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderEditMode = () => {
    return (
      <View style={styles.form}>
        {Object.entries(formState).map(([key, field]) => (
          <View
            key={key}
            style={[
              styles.inputContainer,
              { 
                borderColor: errors[key] ? theme.colors.error : theme.colors.border,
              },
            ]}
          >
            <View style={styles.labelContainer}>
              <Ionicons
                name={getIconForField(key)}
                size={18}
                color={errors[key] ? theme.colors.error : theme.colors.primary}
                style={styles.inputIcon}
              />
              <Text style={[styles.label, { 
                color: errors[key] ? theme.colors.error : theme.colors.textSecondary 
              }]}>
                {field.label} {validationRules[key]?.required && '*'}
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: errors[key] ? theme.colors.error : 'transparent',
                  height: key === 'bio' ? 80 : 44, // Make bio field taller
                },
              ]}
              value={field.value}
              onChangeText={(text) => handleInputChange(key, text)}
              keyboardType={field.keyboardType}
              placeholder={field.placeholder}
              placeholderTextColor={theme.colors.textSecondary}
              blurOnSubmit={true}
              returnKeyType={key === 'bio' ? 'done' : 'next'}
              multiline={key === 'bio'} // Allow multiple lines for bio
              textAlignVertical={key === 'bio' ? 'top' : 'center'}
              underlineColorAndroid="transparent"
            />
            {errors[key] && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors[key]}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {isEditing ? 'Edit Profile' : 'Personal Info'}
        </Text>
        <TouchableOpacity
          onPress={() => (isEditing ? saveUserData() : setIsEditing(true))}
          style={styles.editButton}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Ionicons
              name={isEditing ? 'checkmark' : 'pencil-outline'}
              size={24}
              color={theme.colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: isEditing ? 120 : 40 }}
        showsVerticalScrollIndicator={false}
      >
        {isEditing ? renderEditMode() : renderViewMode()}
      </KeyboardAwareScrollView>

      {isEditing && (
        <View style={[styles.editingBar, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: theme.colors.error }]}
            onPress={cancelEditing}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
            onPress={saveUserData}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  viewContainer: {
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(229, 124, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  inputIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    margin: 8,
  },
  errorText: {
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontWeight: '500',
  },
  editingBar: {
    flexDirection: 'row',
    padding: 16,
    paddingHorizontal: 24,
    gap: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});