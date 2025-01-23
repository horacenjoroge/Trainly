import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  background: '#120B42',
  primary: '#E57C0B',
  surface: '#1A144B',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
};

const TrainingOptions = [
  {
    name: 'Swimming',
    icon: 'water',
    image: require('../assets/images/pool.jpg'),
    description: 'Full body workout in the pool'
  },
  {
    name: 'Bike Trail',
    icon: 'bicycle',
    image: require('../assets/images/bike.jpg'),
    description: 'Cardiovascular endurance ride'
  },
  {
    name: 'Running Trail',
    icon: 'run',
    image: require('../assets/images/run.jpg'),
    description: 'High-intensity cardio session'
  },
  {
    name: 'Gym Session',
    icon: 'fitness',
    image: require('../assets/images/gym.jpg'),
    description: 'Strength and muscle training'
  }
];

const TrainingSelectionScreen = ({ navigation }) => {
  const handleTrainingSelect = (training) => {
    navigation.navigate('Training', { activity: training });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Training</Text>
      </View>
      <View style={styles.optionsContainer}>
        {TrainingOptions.map((option) => (
          <TouchableOpacity 
            key={option.name}
            style={styles.optionCard}
            onPress={() => handleTrainingSelect(option.name)}
          >
            <Image 
              source={option.image} 
              style={styles.optionImage} 
              resizeMode="cover"
            />
            <View style={styles.optionOverlay}>
              <Ionicons 
                name={option.icon} 
                size={40} 
                color={colors.primary} 
              />
              <Text style={styles.optionTitle}>{option.name}</Text>
              <Text style={styles.optionDescription}>
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
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  optionCard: {
    width: '45%',
    height: 200,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  optionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  optionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 20, 75, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  optionTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  optionDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default TrainingSelectionScreen;