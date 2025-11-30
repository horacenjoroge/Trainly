// components/gym/WorkoutTimer.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * WorkoutTimer component - Displays workout duration timer with play/pause control.
 * 
 * @param {Object} props
 * @param {number} props.workoutDuration - Current workout duration in seconds
 * @param {boolean} props.timerActive - Whether timer is currently active
 * @param {Function} props.setTimerActive - Callback to toggle timer active state
 * @param {Function} props.formatTime - Function to format time display
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element} The rendered WorkoutTimer component
 */
const WorkoutTimer = React.memo(({ workoutDuration, timerActive, setTimerActive, formatTime, colors }) => (
  <View style={[styles.timerContainer, { backgroundColor: colors.primary + '15' }]}>
    <View style={styles.timerContent}>
      <View style={styles.timerInfo}>
        <Ionicons name="time-outline" size={20} color={colors.primary} />
        <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>Workout Time</Text>
      </View>
      <Text style={[styles.timerValue, { color: colors.primary }]}>{formatTime(workoutDuration)}</Text>
    </View>
    <TouchableOpacity 
      style={[styles.timerButton, { backgroundColor: timerActive ? colors.error : colors.primary }]}
      onPress={() => setTimerActive(!timerActive)}
    >
      <Ionicons 
        name={timerActive ? "pause" : "play"} 
        size={16} 
        color="#FFFFFF" 
      />
      <Text style={styles.timerButtonText}>
        {timerActive ? "Pause" : "Resume"}
      </Text>
    </TouchableOpacity>
  </View>
));

WorkoutTimer.displayName = 'WorkoutTimer';

const styles = StyleSheet.create({
  timerContainer: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
  },
  timerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timerLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  timerValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  timerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default WorkoutTimer;

