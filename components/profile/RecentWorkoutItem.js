// components/profile/RecentWorkoutItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { formatDuration } from '../../utils/formatUtils';

/**
 * Get workout icon name based on workout type.
 * 
 * @param {string} type - Workout type (Swimming, Running, Cycling, Gym)
 * @returns {string} Ionicons icon name
 */
const getWorkoutIcon = (type) => {
  const icons = {
    'Swimming': 'water-outline',
    'Running': 'walk-outline',
    'Cycling': 'bicycle-outline',
    'Gym': 'barbell-outline',
  };
  return icons[type] || 'fitness-outline';
};

/**
 * RecentWorkoutItem component - Displays a single recent workout item.
 * 
 * @param {Object} props
 * @param {Object} props.workout - Workout object with type, duration, calories, date
 * @param {Function} props.onPress - Callback when workout item is pressed
 * @returns {JSX.Element} The rendered RecentWorkoutItem component
 */
const RecentWorkoutItem = React.memo(({ workout, onPress }) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <TouchableOpacity 
      style={[styles.workoutItem, { 
        backgroundColor: colors.surface,
        borderColor: colors.border 
      }]}
      onPress={onPress}
    >
      <View style={[styles.workoutIcon, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons 
          name={getWorkoutIcon(workout.type)} 
          size={20} 
          color={colors.primary} 
        />
      </View>
      <View style={styles.workoutInfo}>
        <Text style={[styles.workoutType, { color: colors.text }]}>
          {workout.type}
        </Text>
        <Text style={[styles.workoutDetails, { color: colors.textSecondary }]}>
          {formatDuration(workout.duration || 0)} • {workout.calories || 0} cal
        </Text>
      </View>
      <Text style={[styles.workoutDate, { color: colors.textSecondary }]}>
        {new Date(workout.date || workout.startTime || workout.endTime).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
});

RecentWorkoutItem.displayName = 'RecentWorkoutItem';

const styles = StyleSheet.create({
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutDetails: {
    fontSize: 12,
  },
  workoutDate: {
    fontSize: 12,
  },
});

export default RecentWorkoutItem;

