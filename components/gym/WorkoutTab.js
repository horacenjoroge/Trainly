// components/gym/WorkoutTab.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WorkoutTimer from './WorkoutTimer';
import RestTimer from './RestTimer';
import WorkoutStats from './WorkoutStats';
import ExerciseList from './ExerciseList';
import EmptyWorkoutState from './EmptyWorkoutState';
import WorkoutSummaryModal from './WorkoutSummaryModal';
import useWorkoutTab from '../../hooks/useWorkoutTab';

const WorkoutTab = ({
  selectedExercises,
  workoutDuration,
  timerActive,
  setTimerActive,
  restTimerActive,
  restTimeRemaining,
  formatTime,
  skipRestTimer,
  removeExercise,
  openSetModal,
  finishWorkout,
  setActiveTab,
  colors,
}) => {
  const {
    showSummaryModal,
    workoutSummary,
    getExerciseCompletion,
    handleFinishWorkout,
    handleSaveWorkout,
    handleCloseModal,
    hasExercises,
    canFinish,
  } = useWorkoutTab(selectedExercises, workoutDuration, finishWorkout);

  return (
    <View style={styles.container}>
      {/* Header with Timer */}
      <WorkoutTimer
        workoutDuration={workoutDuration}
        timerActive={timerActive}
        setTimerActive={setTimerActive}
        formatTime={formatTime}
        colors={colors}
      />
      
      {/* Rest Timer */}
      <RestTimer
        restTimerActive={restTimerActive}
        restTimeRemaining={restTimeRemaining}
        formatTime={formatTime}
        skipRestTimer={skipRestTimer}
        colors={colors}
      />
      
      {hasExercises ? (
        <>
          {/* Workout Stats */}
          <WorkoutStats selectedExercises={selectedExercises} colors={colors} />
          
          {/* Exercise List */}
          <ExerciseList
            exercises={selectedExercises}
            removeExercise={removeExercise}
            openSetModal={openSetModal}
            getExerciseCompletion={getExerciseCompletion}
            colors={colors}
          />
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.addMoreButton, { borderColor: colors.primary }]}
              onPress={() => setActiveTab('exercises')}
            >
              <Ionicons name="add" size={20} color={colors.primary} />
              <Text style={[styles.addMoreText, { color: colors.primary }]}>
                Add More
              </Text>
            </TouchableOpacity>
            
            {canFinish && (
              <TouchableOpacity
                style={[styles.actionButton, styles.finishButton, { backgroundColor: colors.primary }]}
                onPress={handleFinishWorkout}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.finishButtonText}>Finish Workout</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <EmptyWorkoutState setActiveTab={setActiveTab} colors={colors} />
      )}

      {/* Workout Summary Modal */}
      <WorkoutSummaryModal
        visible={showSummaryModal}
        onClose={handleCloseModal}
        onSave={handleSaveWorkout}
        workoutData={workoutSummary}
        colors={colors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  addMoreButton: {
    borderWidth: 2,
  },
  addMoreText: {
    fontWeight: '600',
    marginLeft: 6,
  },
  finishButton: {
    flex: 2,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default WorkoutTab;