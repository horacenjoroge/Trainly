import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/api';

const USER_DATA_KEY = '@user_data';

export default function PersonalInfoScreen({ navigation }) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  // Use a safer approach to state management with controlled inputs
  const [formState, setFormState] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    fitnessLevel: '',
    emergencyContact: '',
  });
  
  const [loading, setLoading] = useState(true);
  
  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  // Load user data from storage and API
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get data from AsyncStorage
      const savedData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormState(oldState => ({
            ...oldState,
            ...parsedData
          }));
        } catch (parseError) {
          console.error('Error parsing saved data:', parseError);
        }
      }
      
      // Try to get data from API
      try {
        const profileData = await userService.getUserProfile();
        if (profileData) {
          setFormState(oldState => ({
            ...oldState,
            fullName: profileData.name || oldState.fullName,
            email: profileData.email || oldState.email,
            // Map other fields as needed
          }));
        }
      } catch (apiError) {
        console.error('Error fetching from API:', apiError);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simple input change handler that avoids useState setter bugs
  const handleInputChange = (field, value) => {
    // Using the function form to ensure we're working with the latest state
    setFormState(oldState => {
      // Create a new object to ensure state change triggers properly
      const newState = { ...oldState };
      newState[field] = value;
      return newState;
    });
  };

  const saveUserData = async () => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(formState));
      
      // Try to update on API
      try {
        await userService.updateUserProfile({ 
          name: formState.fullName,
          bio: formState.fitnessLevel ? `${formState.fitnessLevel} fitness level` : undefined
        });
      } catch (apiError) {
        console.error('Error updating profile on API:', apiError);
      }
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save profile updates');
    }
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    loadUserData(); // Reset to saved data
  };

  // Super simple controlled input component
  const ControlledInput = ({ label, value, field, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border
          }
        ]}
        value={value || ''} // Ensure it's never undefined
        onChangeText={(text) => handleInputChange(field, text)}
        editable={isEditing}
        keyboardType={keyboardType}
        placeholderTextColor={theme.colors.textSecondary}
        underlineColorAndroid="transparent" // Fix for some Android versions
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Personal Information</Text>
        <TouchableOpacity
          onPress={() => isEditing ? saveUserData() : setIsEditing(true)}
          style={styles.editButton}
        >
          <Ionicons 
            name={isEditing ? "checkmark" : "pencil"} 
            size={24} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.form}>
          <ControlledInput label="Full Name" value={formState.fullName} field="fullName" />
          <ControlledInput label="Username" value={formState.username} field="username" />
          <ControlledInput 
            label="Email" 
            value={formState.email} 
            field="email"
            keyboardType="email-address" 
          />
          <ControlledInput 
            label="Phone" 
            value={formState.phone} 
            field="phone"
            keyboardType="phone-pad" 
          />
          <ControlledInput label="Date of Birth" value={formState.dateOfBirth} field="dateOfBirth" />
          <ControlledInput label="Gender" value={formState.gender} field="gender" />
          <ControlledInput 
            label="Height (cm)" 
            value={formState.height} 
            field="height"
            keyboardType="numeric" 
          />
          <ControlledInput 
            label="Weight (kg)" 
            value={formState.weight} 
            field="weight"
            keyboardType="numeric" 
          />
          <ControlledInput label="Fitness Level" value={formState.fitnessLevel} field="fitnessLevel" />
          <ControlledInput 
            label="Emergency Contact" 
            value={formState.emergencyContact} 
            field="emergencyContact"
            keyboardType="phone-pad" 
          />
        </View>
      </KeyboardAwareScrollView>
      
      {isEditing && (
        <View style={[styles.editingBar, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: theme.colors.error }]}
            onPress={cancelEditing}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
            onPress={saveUserData}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 16,
  },
  editingBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});