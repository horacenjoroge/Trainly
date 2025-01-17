import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ExerciseCard = ({ title, sets, reps, isCompleted, onToggle }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      style={[
        styles.exerciseCard, 
        { backgroundColor: theme.colors.surface },
        isCompleted && { backgroundColor: theme.colors.border }
      ]} 
      onPress={onToggle}
    >
      <View style={styles.exerciseInfo}>
        <Text style={[styles.exerciseTitle, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.exerciseDetails, { color: theme.colors.textSecondary }]}>
          {sets} sets × {reps} reps
        </Text>
      </View>
      <View style={[
        styles.checkbox, 
        { borderColor: theme.colors.primary },
        isCompleted && { backgroundColor: theme.colors.primary }
      ]}>
        {isCompleted && <Ionicons name="checkmark" size={20} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
};

export default function TrainingScreen({ navigation }) {
  const theme = useTheme();
  const [exercises, setExercises] = useState([
    { id: 1, title: 'Barbell Squats', sets: 4, reps: 12, completed: false },
    { id: 2, title: 'Deadlifts', sets: 3, reps: 10, completed: false },
    { id: 3, title: 'Bench Press', sets: 4, reps: 8, completed: false },
    { id: 4, title: 'Shoulder Press', sets: 3, reps: 12, completed: false },
    { id: 5, title: 'Pull-ups', sets: 3, reps: 10, completed: false },
  ]);

  const [timer, setTimer] = useState(45 * 60);
  const [isActive, setIsActive] = useState(false);

  const toggleExercise = (id) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Full Body Workout</Text>
        <View style={[styles.timerContainer, { backgroundColor: theme.colors.border }]}>
          <Text style={[styles.timer, { color: theme.colors.text }]}>{formatTime(timer)}</Text>
          <TouchableOpacity 
            style={[styles.timerButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setIsActive(!isActive)}
          >
            <Ionicons name={isActive ? "pause" : "play"} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.progress, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: theme.colors.primary,
                width: `${(exercises.filter(e => e.completed).length / exercises.length) * 100}%` 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          {exercises.filter(e => e.completed).length}/{exercises.length} completed
        </Text>
      </View>

      <ScrollView style={styles.exerciseList}>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            title={exercise.title}
            sets={exercise.sets}
            reps={exercise.reps}
            isCompleted={exercise.completed}
            onToggle={() => toggleExercise(exercise.id)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.finishButton, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={styles.finishButtonText}>Finish Workout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
  },
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  timerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    padding: 20,
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
  },
  exerciseList: {
    padding: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButton: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});