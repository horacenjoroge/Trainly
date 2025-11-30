// hooks/useWorkoutTab.js
import { useState, useMemo } from 'react';

/**
 * Custom hook for managing workout tab state and logic
 * 
 * @param {Array} selectedExercises - Array of selected exercises
 * @param {Number} workoutDuration - Duration of the workout in seconds
 * @param {Function} finishWorkout - Callback to finish and save the workout
 * @returns {Object} Workout tab state and handlers
 */
const useWorkoutTab = (selectedExercises, workoutDuration, finishWorkout) => {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [workoutSummary, setWorkoutSummary] = useState(null);

  /**
   * Calculate completion percentage for an exercise
   * @param {Object} exercise - Exercise object with sets array
   * @returns {Number} Completion percentage (0-100)
   */
  const getExerciseCompletion = (exercise) => {
    if (!exercise.sets || exercise.sets.length === 0) return 0;
    const completedSets = exercise.sets.filter(set => set.completed).length;
    return (completedSets / exercise.sets.length) * 100;
  };

  /**
   * Handle finishing the workout - calculates summary and shows modal
   */
  const handleFinishWorkout = () => {
    const completedSets = selectedExercises.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0);
      
    const totalWeight = selectedExercises.reduce((total, ex) => 
      total + ex.sets.reduce((setTotal, set) => 
        setTotal + (set.completed ? set.weight * set.actualReps : 0), 0), 0);

    const summary = {
      duration: workoutDuration,
      exercises: selectedExercises,
      stats: {
        totalSets: completedSets,
        totalWeight: totalWeight,
        exercises: selectedExercises.length
      }
    };

    setWorkoutSummary(summary);
    setShowSummaryModal(true);
  };

  /**
   * Handle saving the workout - closes modal and calls finishWorkout
   */
  const handleSaveWorkout = () => {
    setShowSummaryModal(false);
    finishWorkout();
  };

  /**
   * Close the summary modal without saving
   */
  const handleCloseModal = () => {
    setShowSummaryModal(false);
  };

  // Memoized computed values
  const hasExercises = useMemo(() => selectedExercises.length > 0, [selectedExercises.length]);
  const canFinish = useMemo(() => 
    selectedExercises.some(ex => ex.sets.some(set => set.completed)),
    [selectedExercises]
  );

  return {
    showSummaryModal,
    workoutSummary,
    getExerciseCompletion,
    handleFinishWorkout,
    handleSaveWorkout,
    handleCloseModal,
    hasExercises,
    canFinish,
  };
};

export default useWorkoutTab;

