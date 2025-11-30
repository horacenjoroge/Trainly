// components/gym/SetButton.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * SetButton component - Displays a single set button with completion status.
 * 
 * @param {Object} props
 * @param {Object} props.set - Set object with completed, weight, actualReps
 * @param {number} props.index - Index of the set (0-based)
 * @param {Function} props.onPress - Callback when set button is pressed
 * @param {Object} props.colors - Theme colors object
 * @param {boolean} props.isActive - Whether this is the active/next set
 * @returns {JSX.Element} The rendered SetButton component
 */
const SetButton = React.memo(({ set, index, onPress, colors, isActive }) => (
  <TouchableOpacity
    style={[
      styles.setButton,
      set.completed
        ? { backgroundColor: colors.primary, borderColor: colors.primary } 
        : isActive
        ? { backgroundColor: colors.primary + '20', borderColor: colors.primary, borderWidth: 2 }
        : { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }
    ]}
    onPress={onPress}
  >
    <Text 
      style={[
        styles.setText, 
        { color: set.completed ? '#FFFFFF' : isActive ? colors.primary : colors.text }
      ]}
    >
      {index + 1}
    </Text>
    {set.completed && (
      <View style={styles.setDetails}>
        <Text style={styles.weightText}>{set.weight}kg</Text>
        <Text style={styles.repsText}>×{set.actualReps}</Text>
      </View>
    )}
  </TouchableOpacity>
));

SetButton.displayName = 'SetButton';

const styles = StyleSheet.create({
  setButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 8,
  },
  setText: {
    fontSize: 16,
    fontWeight: '700',
  },
  setDetails: {
    position: 'absolute',
    bottom: -18,
    alignItems: 'center',
  },
  weightText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  repsText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SetButton;

