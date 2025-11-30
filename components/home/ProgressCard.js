import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * Helper function to format duration
 */
const formatDuration = (totalMinutes) => {
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}m`;
};

/**
 * ProgressCard component for displaying user's workout progress
 */
const ProgressCard = ({ stats, loading = false, onViewFullStats }) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressTitle, { color: colors.primary }]}>My Progress</Text>
        <TouchableOpacity onPress={onViewFullStats}>
          <Text style={[styles.progressEdit, { color: colors.secondary }]}>View Stats</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.progressLoading}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.progressLoadingText, { color: colors.textSecondary }]}>
            Loading progress...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.progressStats}>
            <View style={styles.progressStatItem}>
              <Ionicons name="trophy-outline" size={24} color={colors.primary} />
              <Text style={[styles.progressStatValue, { color: colors.primary }]}>
                {stats.totalWorkouts || 0}
              </Text>
              <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>
                Workouts
              </Text>
            </View>
            <View style={styles.progressStatItem}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <Text style={[styles.progressStatValue, { color: colors.primary }]}>
                {formatDuration(stats.totalDuration || 0)}
              </Text>
              <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>
                Time
              </Text>
            </View>
            <View style={styles.progressStatItem}>
              <Ionicons name="flame-outline" size={24} color={colors.primary} />
              <Text style={[styles.progressStatValue, { color: colors.primary }]}>
                {Math.round(stats.totalCalories || 0)}
              </Text>
              <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>
                Calories
              </Text>
            </View>
          </View>
          
          {/* Simple weekly goal progress */}
          <View style={styles.weeklyGoalContainer}>
            <View style={styles.weeklyGoalHeader}>
              <Text style={[styles.weeklyGoalTitle, { color: colors.text }]}>
                This Week
              </Text>
              <Text style={[styles.weeklyGoalText, { color: colors.textSecondary }]}>
                {stats.weeklyWorkouts || 0}/{stats.weeklyGoal || 3} workouts
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: `${colors.primary}20` }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min(100, ((stats.weeklyWorkouts || 0) / (stats.weeklyGoal || 3)) * 100)}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
          </View>
          
          {/* Last workout info */}
          {stats.lastWorkout && (
            <View style={styles.lastWorkoutContainer}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
              <Text style={[styles.lastWorkoutText, { color: colors.textSecondary }]}>
                Last workout: {stats.lastWorkout.type} {stats.lastWorkout.timeAgo}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressEdit: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressLoading: {
    alignItems: 'center',
    padding: 20,
  },
  progressLoadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  weeklyGoalContainer: {
    marginTop: 8,
  },
  weeklyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weeklyGoalTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  weeklyGoalText: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  lastWorkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  lastWorkoutText: {
    fontSize: 12,
  },
});

export default ProgressCard;

