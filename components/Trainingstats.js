// components/TrainingStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TrainingStats({ distance, timer, theme }) {
  // Format pace as minutes/km instead of m/s (more common for runners)
  const formatPace = () => {
    if (distance <= 0 || timer <= 0) return '--:--';
    
    // Calculate seconds per kilometer (common pace unit in running apps)
    const secsPerKm = timer / distance;
    
    // Convert to minutes:seconds format
    const mins = Math.floor(secsPerKm / 60);
    const secs = Math.floor(secsPerKm % 60);
    
    // Format as mm:ss
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // Format timer as hh:mm:ss
  const formatTime = () => {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
    
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  
  // Calculate calories more accurately based on activity intensity
  const calculateCalories = () => {
    // Base metabolic rate (approximation)
    const baseRate = 5; // calories per minute for moderate activity
    
    // Adjust based on intensity (using pace as a proxy for intensity)
    let intensityFactor = 1;
    
    if (distance > 0 && timer > 0) {
      const paceInMinsPerKm = timer / 60 / distance;
      
      // Faster pace = higher intensity (adjust these thresholds as needed)
      if (paceInMinsPerKm < 5) intensityFactor = 1.5; // Very fast
      else if (paceInMinsPerKm < 6) intensityFactor = 1.3; // Fast
      else if (paceInMinsPerKm < 7.5) intensityFactor = 1.1; // Moderate
      else intensityFactor = 1; // Slower pace
    }
    
    return Math.floor((timer / 60) * baseRate * intensityFactor);
  };

  return (
    <View style={[styles.statsContainer, { 
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.primary + '20'
    }]}>
      <View style={styles.stat}>
        <Ionicons name="speedometer-outline" size={16} color={theme.colors.textSecondary} style={styles.icon} />
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {distance.toFixed(2)} km
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          DISTANCE
        </Text>
      </View>
      
      <View style={styles.stat}>
        <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} style={styles.icon} />
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {formatTime()}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          TIME
        </Text>
      </View>
      
      <View style={styles.stat}>
        <Ionicons name="walk-outline" size={16} color={theme.colors.textSecondary} style={styles.icon} />
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {formatPace()} min/km
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          PACE
        </Text>
      </View>
      
      <View style={styles.stat}>
        <Ionicons name="flame-outline" size={16} color={theme.colors.textSecondary} style={styles.icon} />
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {calculateCalories()}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          CALORIES
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 4,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});