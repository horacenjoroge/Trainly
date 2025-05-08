// screens/EditStatsScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual backend URL
const API_URL = 'http://192.168.100.88:3000';

// Color Palette
const colors = {
  background: '#120B42',
  primary: '#E57C0B',
  surface: '#1A144B',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#4A90E2',
  error: '#E53935',
};

const EditStatsScreen = ({ navigation, route }) => {
  const initialStats = route.params?.stats || { workouts: 0, hours: 0, calories: 0 };
  
  const [workouts, setWorkouts] = useState(initialStats.workouts.toString());
  const [hours, setHours] = useState(initialStats.hours.toString());
  const [calories, setCalories] = useState(initialStats.calories.toString());
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validate inputs (ensure they're numbers)
    if (isNaN(workouts) || isNaN(hours) || isNaN(calories)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for all fields');
      return;
    }

    setLoading(true);
    try {
      // Convert to numbers
      const statsData = {
        workouts: parseInt(workouts, 10),
        hours: parseFloat(hours),
        calories: parseInt(calories, 10)
      };

      // Get JWT token
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        // Update stats via API
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };
        
        await axios.put(`${API_URL}/api/users/stats`, statsData, config);
      }
      
      // Go back to previous screen
      navigation.goBack();
      
      // If a callback was provided, call it
      if (route.params?.onUpdate) {
        route.params.onUpdate();
      }
    } catch (error) {
      console.error('Error updating stats:', error);
      Alert.alert('Error', 'Failed to update stats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="light-content"
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Progress</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Workouts Completed</Text>
          <TextInput
            style={styles.input}
            value={workouts}
            onChangeText={setWorkouts}
            placeholder="Number of workouts"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Hours Trained</Text>
          <TextInput
            style={styles.input}
            value={hours}
            onChangeText={setHours}
            placeholder="Hours spent training"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Calories Burned</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            placeholder="Total calories burned"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.saveButtonText}>Save Progress</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40, // To balance the header
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: colors.primary,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditStatsScreen;