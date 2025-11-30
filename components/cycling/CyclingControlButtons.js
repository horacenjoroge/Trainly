// components/cycling/CyclingControlButtons.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * CyclingControlButtons component - Displays control buttons for cycling workout.
 * 
 * @param {Object} props
 * @param {boolean} props.isActive - Whether workout is active
 * @param {boolean} props.isPaused - Whether workout is paused
 * @param {number} props.distance - Total distance in meters
 * @param {Function} props.onStartPause - Callback for start/pause button
 * @param {Function} props.onInterval - Callback for interval button
 * @param {Function} props.onFinish - Callback for finish button
 * @returns {JSX.Element} The rendered CyclingControlButtons component
 */
const CyclingControlButtons = React.memo(({ 
  isActive, 
  isPaused, 
  distance, 
  onStartPause, 
  onInterval, 
  onFinish 
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.controls}>
      <TouchableOpacity
        style={[
          styles.controlButton, 
          { backgroundColor: !isActive ? colors.primary : isPaused ? colors.primary : colors.error }
        ]}
        onPress={onStartPause}
      >
        <Ionicons 
          name={!isActive ? "play" : isPaused ? "play" : "pause"} 
          size={24} 
          color="#FFFFFF" 
        />
        <Text style={styles.controlButtonText}>
          {!isActive ? "Start" : isPaused ? "Resume" : "Pause"}
        </Text>
      </TouchableOpacity>

      {isActive && (
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.warning || '#FF9800' }]}
          onPress={onInterval}
        >
          <Ionicons name="timer-outline" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Interval</Text>
        </TouchableOpacity>
      )}

      {distance > 0 && (
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.success || '#4CAF50' }]}
          onPress={onFinish}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Finish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

CyclingControlButtons.displayName = 'CyclingControlButtons';

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 100,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CyclingControlButtons;

