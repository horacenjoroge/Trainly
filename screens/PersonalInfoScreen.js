import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = '@user_data';

export default function PersonalInfoScreen({ navigation }) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
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

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (savedData) {
        setUserData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save profile updates');
    }
  };

  const InputField = ({ label, value, field, keyboardType = 'default' }) => (
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
        value={value}
        onChangeText={(text) => setUserData(prev => ({ ...prev, [field]: text }))}
        editable={isEditing}
        keyboardType={keyboardType}
        placeholderTextColor={theme.colors.textSecondary}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.scrollView}>
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

        <View style={styles.form}>
          <InputField label="Full Name" value={userData.fullName} field="fullName" />
          <InputField label="Username" value={userData.username} field="username" />
          <InputField 
            label="Email" 
            value={userData.email} 
            field="email"
            keyboardType="email-address" 
          />
          <InputField 
            label="Phone" 
            value={userData.phone} 
            field="phone"
            keyboardType="phone-pad" 
          />
          <InputField label="Date of Birth" value={userData.dateOfBirth} field="dateOfBirth" />
          <InputField label="Gender" value={userData.gender} field="gender" />
          <InputField 
            label="Height (cm)" 
            value={userData.height} 
            field="height"
            keyboardType="numeric" 
          />
          <InputField 
            label="Weight (kg)" 
            value={userData.weight} 
            field="weight"
            keyboardType="numeric" 
          />
          <InputField label="Fitness Level" value={userData.fitnessLevel} field="fitnessLevel" />
          <InputField 
            label="Emergency Contact" 
            value={userData.emergencyContact} 
            field="emergencyContact"
            keyboardType="phone-pad" 
          />
        </View>
      </ScrollView>
      
      {isEditing && (
        <View style={[styles.editingBar, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: theme.colors.error }]}
            onPress={() => {
              setIsEditing(false);
              loadUserData();
            }}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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