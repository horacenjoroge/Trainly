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

const USER_DATA_KEY = '@user_data';

export default function PersonalInfoScreen({ navigation }) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [formState, setFormState] = useState({
    fullName: { value: '', label: 'Full Name', keyboardType: 'default' },
    username: { value: '', label: 'Username', keyboardType: 'default' },
    email: { value: '', label: 'Email', keyboardType: 'email-address' },
    phone: { value: '', label: 'Phone Number', keyboardType: 'phone-pad' },
    dateOfBirth: { value: '', label: 'Date of Birth', keyboardType: 'default' },
    gender: { value: '', label: 'Gender', keyboardType: 'default' },
    height: { value: '', label: 'Height (cm)', keyboardType: 'numeric' },
    weight: { value: '', label: 'Weight (kg)', keyboardType: 'numeric' },
    fitnessLevel: { value: '', label: 'Fitness Level', keyboardType: 'default' },
  });

  const visibleFieldsInViewMode = 4;

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

  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log('Loading user data from storage...');

      // Step 1: Load data from AsyncStorage
      let localFormState = { ...formState };
      const savedData = await AsyncStorage.getItem(USER_DATA_KEY);
      console.log('Retrieved data from storage:', savedData);

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log('Parsed data:', parsedData);

          Object.keys(localFormState).forEach((key) => {
            if (parsedData[key]) {
              localFormState[key] = {
                ...localFormState[key],
                value: parsedData[key],
              };
            }
          });
          console.log('Local form state after AsyncStorage:', localFormState);
        } catch (parseError) {
          console.error('Error parsing saved data:', parseError);
        }
      } else {
        console.log('No data found with main key, checking individual fields');
        for (const key of Object.keys(localFormState)) {
          try {
            const value = await AsyncStorage.getItem(`@user_${key}`);
            if (value) {
              localFormState[key] = {
                ...localFormState[key],
                value,
              };
            }
          } catch (error) {
            console.log(`Error reading field ${key}:`, error);
          }
        }
      }

      // Step 2: Load data from API and merge with local data
      try {
        const profileData = await userService.getUserProfile();
        console.log('API response from GET /users/profile:', profileData);

        if (profileData) {
          // Update only the fields provided by the API
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
          // Add more fields if the API returns them (e.g., username, gender, etc.)
          setFormState(updatedFormState);
          console.log('Updated form state after merging API data:', updatedFormState);
        } else {
          // If API returns no data, use local data
          setFormState(localFormState);
        }
      } catch (apiError) {
        console.log('Error fetching from API (using local data only):', apiError);
        setFormState(localFormState);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setFormState({ ...formState }); // Fallback to initial state on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormState((oldState) => ({
      ...oldState,
      [field]: { ...oldState[field], value },
    }));
  };

  const saveUserData = async () => {
    try {
      setIsSaving(true);
      Keyboard.dismiss();

      const dataToSave = Object.entries(formState).reduce((obj, [key, field]) => {
        obj[key] = field.value;
        return obj;
      }, {});

      console.log('Saving data to AsyncStorage:', JSON.stringify(dataToSave));
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(dataToSave));

      for (const [key, value] of Object.entries(dataToSave)) {
        if (value && value.trim() !== '') {
          await AsyncStorage.setItem(`@user_${key}`, value);
        }
      }

      try {
        await userService.updateUserProfile({
          name: formState.fullName.value,
          bio: formState.fitnessLevel.value
            ? `${formState.fitnessLevel.value} fitness level`
            : undefined,
        });
      } catch (apiError) {
        console.error('Error updating profile on API:', apiError);
      }

      const savedData = await AsyncStorage.getItem(USER_DATA_KEY);
      console.log('Data retrieved after save:', savedData);

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
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
    loadUserData();
  };

  const getVisibleFields = () => {
    return Object.entries(formState).filter(([key, field]) => field.value);
  };

  const hasFields = () => {
    return Object.values(formState).some((field) => field.value);
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
      emergencyContact: 'alert-circle-outline',
    };
    return iconMap[fieldName] || 'information-circle-outline';
  };

  const renderEditMode = () => {
    return (
      <View style={styles.form}>
        {Object.entries(formState).map(([key, field]) => (
          <View
            key={key}
            style={[
              styles.inputContainer,
              { borderColor: theme.colors.border },
            ]}
          >
            <View style={styles.labelContainer}>
              <Ionicons
                name={getIconForField(key)}
                size={18}
                color={theme.colors.primary}
                style={styles.inputIcon}
              />
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                {field.label}
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                },
              ]}
              value={field.value}
              onChangeText={(text) => handleInputChange(key, text)}
              keyboardType={field.keyboardType}
              placeholderTextColor={theme.colors.textSecondary}
              blurOnSubmit={true}
              returnKeyType={key === 'fitnessLevel' ? 'done' : 'next'}
              underlineColorAndroid="transparent"
            />
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
  moreButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 16,
  },
  moreButtonText: {
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
    marginBottom: 16,
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