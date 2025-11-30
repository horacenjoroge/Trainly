// components/gym/WorkoutStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * WorkoutStats component - Displays workout statistics (exercises, sets, completion).
 * 
 * @param {Object} props
 * @param {Array} props.selectedExercises - Array of selected exercises
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element} The rendered WorkoutStats component
 */
const WorkoutStats = React.memo(({ selectedExercises, colors }) => {
  const totalSets = selectedExercises.reduce((total, ex) => total + ex.sets.length, 0);
  const completedSets = selectedExercises.reduce((total, ex) => 
    total + ex.sets.filter(set => set.completed).length, 0);
  const completionPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {selectedExercises.length}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {completedSets}/{totalSets}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sets</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {completionPercentage}%
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Complete</Text>
      </View>
    </View>
  );
});

WorkoutStats.displayName = 'WorkoutStats';

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default WorkoutStats;

