// Updated TrainingSelectionScreen.js - FIXED navigation for GymWorkout

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const TrainingOptions = [
  {
    name: 'Swimming',
    icon: 'water-outline',
    image: require('../assets/images/pool.jpg'),
    description: 'Full body workout in the pool',
    requiresMap: true,
    available: false // Temporarily disabled due to infinite loop issue
  },
  {
    name: 'Bike Trail',
    icon: 'bicycle-outline',
    image: require('../assets/images/bike.jpg'),
    description: 'Cardiovascular endurance ride',
    requiresMap: true,
    available: true
  },
  {
    name: 'Running Trail',
    icon: 'walk-outline',
    image: require('../assets/images/run.jpg'),
    description: 'High-intensity cardio session',
    requiresMap: true,
    available: true
  },
  {
    name: 'Gym Session',
    icon: 'fitness-outline',
    image: require('../assets/images/gym.jpg'),
    description: 'Strength and muscle training',
    requiresMap: false,
    available: true
  }
];

const TrainingSelectionScreen = ({ navigation }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // FIXED: Updated navigation logic
  const handleTrainingSelect = (training, requiresMap, available) => {
    // Check if activity is available
    if (!available) {
      Alert.alert(
        'Coming Soon',
        'This activity is currently under development. Please check back in the next update!',
        [{ text: 'OK' }]
      );
      return;
    }

    if (training === 'Running Trail') {
      // Route Running Trail to enhanced RunningScreen
      navigation.navigate('RunningScreen', { activity: 'Running' });
    } else if (training === 'Swimming') {
      // Route Swimming to enhanced SwimmingScreen
      navigation.navigate('SwimmingScreen', { activity: 'Swimming' });
    } else if (training === 'Bike Trail') {
      // Route Bike Trail to enhanced CyclingScreen
      navigation.navigate('CyclingScreen', { activity: 'Cycling' });
    } else if (training === 'Gym Session') {
      // FIXED: Try nested navigation first, fallback to direct navigation
      try {
        // Option 1: Try nested navigation if we're in HomeStack
        navigation.navigate('TrainingStack', {
          screen: 'GymWorkout',
          params: { activity: training }
        });
      } catch (error) {
        // Option 2: Direct navigation if we're already in TrainingStack
        navigation.navigate('GymWorkout', { activity: training });
      }
    } else if (requiresMap) {
      // For other outdoor activities that need GPS tracking
      navigation.navigate('Training', { activity: training });
    } else {
      // Fallback
      Alert.alert('Error', 'Unable to navigate to this activity. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Choose Your Training</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.optionsContainer}>
        {TrainingOptions.map((option) => (
          <TouchableOpacity
            key={option.name}
            style={[
              styles.optionCard, 
              { backgroundColor: colors.surface },
              !option.available && styles.disabledCard
            ]}
            onPress={() => handleTrainingSelect(option.name, option.requiresMap, option.available)}
          >
            <Image
              source={option.image}
              style={[styles.optionImage, !option.available && styles.disabledImage]}
              resizeMode="cover"
            />
            <View style={styles.optionOverlay}>
              <View style={[
                styles.iconContainer,
                !option.available && styles.disabledIconContainer
              ]}>
                <Ionicons
                  name={option.icon}
                  size={30}
                  color={option.available ? "#FFFFFF" : "#999999"}
                />
              </View>
              <Text style={[
                styles.optionTitle, 
                { color: colors.text },
                !option.available && styles.disabledText
              ]}>
                {option.name}
              </Text>
              <Text style={[
                styles.optionDescription, 
                { color: colors.textSecondary },
                !option.available && styles.disabledText
              ]}>
                {option.available ? option.description : 'Coming Soon'}
              </Text>
              {!option.available && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 8,
  },
  optionCard: {
    width: '48%',
    height: 200,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  disabledCard: {
    opacity: 0.6,
  },
  optionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  disabledImage: {
    opacity: 0.5,
  },
  optionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 125, 44, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledIconContainer: {
    backgroundColor: 'rgba(153, 153, 153, 0.5)',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
  disabledText: {
    color: '#999999',
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  comingSoonText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default TrainingSelectionScreen;