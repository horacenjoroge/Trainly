// components/gym/RestTimer.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * RestTimer component - Displays rest timer with skip functionality.
 * 
 * @param {Object} props
 * @param {boolean} props.restTimerActive - Whether rest timer is active
 * @param {number} props.restTimeRemaining - Remaining rest time in seconds
 * @param {Function} props.formatTime - Function to format time display
 * @param {Function} props.skipRestTimer - Callback to skip rest timer
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element | null} The rendered RestTimer component or null if not active
 */
const RestTimer = React.memo(({ restTimerActive, restTimeRemaining, formatTime, skipRestTimer, colors }) => {
  if (!restTimerActive) return null;
  
  return (
    <View style={[styles.restTimerContainer, { backgroundColor: colors.secondary + '15' }]}>
      <View style={styles.restTimerContent}>
        <Ionicons name="cafe-outline" size={24} color={colors.secondary} />
        <View style={styles.restInfo}>
          <Text style={[styles.restLabel, { color: colors.textSecondary }]}>Rest Time</Text>
          <Text style={[styles.restValue, { color: colors.secondary }]}>
            {formatTime(restTimeRemaining)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.skipButton, { backgroundColor: colors.secondary }]}
          onPress={skipRestTimer}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

RestTimer.displayName = 'RestTimer';

const styles = StyleSheet.create({
  restTimerContainer: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  restTimerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  restValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RestTimer;

