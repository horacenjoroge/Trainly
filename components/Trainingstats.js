// components/TrainingStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TrainingStats({ distance, timer, theme }) {
  return (
    <View style={[styles.statsContainer, { 
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.primary + '20'
    }]}>
      <View style={styles.stat}>
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {distance.toFixed(2)} km
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          DISTANCE
        </Text>
      </View>
      <View style={styles.stat}>
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {(distance * 1000 / timer).toFixed(2) || 0} m/s
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          PACE
        </Text>
      </View>
      <View style={styles.stat}>
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {Math.floor(timer * 5)}
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
    padding: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 4,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});