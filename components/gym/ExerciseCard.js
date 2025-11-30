// components/gym/ExerciseCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SetButton from './SetButton';

/**
 * ExerciseCard component - Displays an exercise with sets, progress, and actions.
 * 
 * @param {Object} props
 * @param {Object} props.item - Exercise object with name, category, sets
 * @param {Function} props.removeExercise - Callback to remove exercise
 * @param {Function} props.openSetModal - Callback to open set modal
 * @param {Function} props.getExerciseCompletion - Function to calculate completion percentage
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element} The rendered ExerciseCard component
 */
const ExerciseCard = React.memo(({ item, removeExercise, openSetModal, getExerciseCompletion, colors }) => {
  const completion = getExerciseCompletion(item);
  const nextSetIndex = item.sets.findIndex(set => !set.completed);
  
  return (
    <View style={[styles.exerciseCard, { backgroundColor: colors.surface }]}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseInfo}>
          <Text style={[styles.exerciseName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.exerciseCategory, { color: colors.textSecondary }]}>
            {item.category} • {item.sets.filter(set => set.completed).length}/{item.sets.length} sets
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => removeExercise(item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.primary + '20' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${completion}%`,
                backgroundColor: colors.primary 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {Math.round(completion)}%
        </Text>
      </View>
      
      {/* Sets Grid */}
      <View style={styles.setsGrid}>
        {item.sets.map((set, idx) => (
          <SetButton
            key={`${item.id}-set-${idx}`}
            set={set}
            index={idx}
            isActive={idx === nextSetIndex}
            onPress={() => openSetModal(item, idx)}
            colors={colors}
          />
        ))}
      </View>
      
      {/* Quick Action Button */}
      {nextSetIndex !== -1 && (
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: colors.primary }]}
          onPress={() => openSetModal(item, nextSetIndex)}
        >
          <Ionicons name="fitness-outline" size={18} color="#FFFFFF" />
          <Text style={styles.quickActionText}>
            Start Set {nextSetIndex + 1}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

ExerciseCard.displayName = 'ExerciseCard';

const styles = StyleSheet.create({
  exerciseCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    minWidth: 35,
  },
  setsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ExerciseCard;

