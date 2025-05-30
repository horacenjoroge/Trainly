// Updated TrainingSelectionScreen.js - Added Swimming navigation

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const TrainingOptions = [
  {
    name: 'Swimming',
    icon: 'water-outline',
    image: require('../assets/images/pool.jpg'),
    description: 'Full body workout in the pool',
    requiresMap: true
  },
  {
    name: 'Bike Trail',
    icon: 'bicycle-outline',
    image: require('../assets/images/bike.jpg'),
    description: 'Cardiovascular endurance ride',
    requiresMap: true
  },
  {
    name: 'Running Trail',
    icon: 'walk-outline',
    image: require('../assets/images/run.jpg'),
    description: 'High-intensity cardio session',
    requiresMap: true
  },
  {
    name: 'Gym Session',
    icon: 'fitness-outline',
    image: require('../assets/images/gym.jpg'),
    description: 'Strength and muscle training',
    requiresMap: false
  }
];

const TrainingSelectionScreen = ({ navigation }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Updated logic to route to enhanced screens
  const handleTrainingSelect = (training, requiresMap) => {
    if (training === 'Running Trail') {
      // Route Running Trail to enhanced RunningScreen
      navigation.navigate('RunningScreen', { activity: 'Running' });
    } else if (training === 'Swimming') {
      // Route Swimming to enhanced SwimmingScreen
      navigation.navigate('SwimmingScreen', { activity: 'Swimming' });
    } else if (requiresMap) {
      // For other outdoor activities that need GPS tracking
      navigation.navigate('Training', { activity: training });
    } else {
      // For gym workouts that don't need GPS
      navigation.navigate('GymWorkout', { activity: training });
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
            style={[styles.optionCard, { backgroundColor: colors.surface }]}
            onPress={() => handleTrainingSelect(option.name, option.requiresMap)}
          >
            <Image
              source={option.image}
              style={styles.optionImage}
              resizeMode="cover"
            />
            <View style={styles.optionOverlay}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={option.icon}
                  size={30}
                  color="#FFFFFF"
                />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>{option.name}</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                {option.description}
              </Text>
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
  optionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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
});

export default TrainingSelectionScreen;