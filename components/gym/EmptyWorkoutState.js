// components/gym/EmptyWorkoutState.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * EmptyWorkoutState component - Displays empty state when no exercises are selected.
 * 
 * @param {Object} props
 * @param {Function} props.setActiveTab - Callback to switch to exercises tab
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element} The rendered EmptyWorkoutState component
 */
const EmptyWorkoutState = React.memo(({ setActiveTab, colors }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="fitness-outline" size={64} color={colors.textSecondary} />
    <Text style={[styles.emptyTitle, { color: colors.text }]}>
      No Exercises Added
    </Text>
    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
      Add exercises from the library to begin your workout session
    </Text>
    <TouchableOpacity
      style={[styles.addExercisesButton, { backgroundColor: colors.primary }]}
      onPress={() => setActiveTab('exercises')}
    >
      <Ionicons name="add" size={20} color="#FFFFFF" />
      <Text style={styles.addExercisesText}>Browse Exercises</Text>
    </TouchableOpacity>
  </View>
));

EmptyWorkoutState.displayName = 'EmptyWorkoutState';

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  addExercisesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addExercisesText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default EmptyWorkoutState;

