// components/gym/ExerciseList.js
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ExerciseCard from './ExerciseCard';

/**
 * ExerciseList component - Renders a list of exercises in a workout
 * 
 * @param {Object} props
 * @param {Array} props.exercises - Array of exercise objects
 * @param {Function} props.removeExercise - Callback to remove an exercise
 * @param {Function} props.openSetModal - Callback to open set modal
 * @param {Function} props.getExerciseCompletion - Function to calculate completion percentage
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element} The rendered ExerciseList component
 */
const ExerciseList = ({ exercises, removeExercise, openSetModal, getExerciseCompletion, colors }) => {
  return (
    <FlatList
      data={exercises}
      keyExtractor={(item, index) => `workout-${item.id}-${index}`}
      renderItem={({ item }) => (
        <ExerciseCard
          item={item}
          removeExercise={removeExercise}
          openSetModal={openSetModal}
          getExerciseCompletion={getExerciseCompletion}
          colors={colors}
        />
      )}
      contentContainerStyle={styles.exercisesList}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  exercisesList: {
    paddingBottom: 16,
  },
});

export default ExerciseList;

