// GymWorkoutScreen.js - Main Component
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import sub-components
import ExercisesTab from '../components/gym/ExercisesTab';
import WorkoutTab from '../components/gym/WorkoutTab';
import ScheduleTab from '../components/gym/ScheduleTab';
import WeightModal from '../components/gym/WeightModal';

// Sample exercise data - FIXED: Ensured unique IDs
const SAMPLE_EXERCISES = [
  { id: 'ex1', name: 'Bench Press', category: 'Chest', sets: 3, reps: 10 },
  { id: 'ex2', name: 'Squats', category: 'Legs', sets: 4, reps: 8 },
  { id: 'ex3', name: 'Deadlift', category: 'Back', sets: 3, reps: 6 },
  { id: 'ex4', name: 'Shoulder Press', category: 'Shoulders', sets: 3, reps: 12 },
  { id: 'ex5', name: 'Pull-ups', category: 'Back', sets: 3, reps: 8 },
  { id: 'ex6', name: 'Lunges', category: 'Legs', sets: 3, reps: 10 },
  { id: 'ex7', name: 'Dumbbell Curls', category: 'Arms', sets: 3, reps: 12 },
  { id: 'ex8', name: 'Tricep Extensions', category: 'Arms', sets: 3, reps: 12 },
  { id: 'ex9', name: 'Leg Press', category: 'Legs', sets: 3, reps: 12 },
  { id: 'ex10', name: 'Chest Fly', category: 'Chest', sets: 3, reps: 12 },
  { id: 'ex11', name: 'Lat Pulldown', category: 'Back', sets: 3, reps: 12 },
  { id: 'ex12', name: 'Leg Curl', category: 'Legs', sets: 3, reps: 12 },
];

// Sample workout schedules
const SAMPLE_SCHEDULES = [
  { id: 'sched1', name: 'Push/Pull/Legs', days: ['Monday', 'Wednesday', 'Friday'] },
  { id: 'sched2', name: 'Full Body', days: ['Tuesday', 'Thursday', 'Saturday'] },
  { id: 'sched3', name: 'Upper/Lower Split', days: ['Monday', 'Tuesday', 'Thursday', 'Friday'] },
];

const GymWorkoutScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const activityType = route.params?.activity || 'Gym Session';
  
  // Main state
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('exercises');
  const [schedules, setSchedules] = useState(SAMPLE_SCHEDULES);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal state
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [weight, setWeight] = useState('');
  const [actualReps, setActualReps] = useState('');
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const restTimerRef = useRef(null);
  
  // Load exercises and history on mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Control main workout timer
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setWorkoutDuration(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);
  
  // Control rest timer
  useEffect(() => {
    if (restTimerActive && restTimeRemaining > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev <= 1) {
            setRestTimerActive(false);
            clearInterval(restTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }
    
    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [restTimerActive, restTimeRemaining]);
  
  // Start main timer when first exercise is added
  useEffect(() => {
    if (selectedExercises.length > 0 && !timerActive) {
      setTimerActive(true);
    }
  }, [selectedExercises]);
  
  // Save workout data when exercises change
  useEffect(() => {
    if (selectedExercises.length > 0) {
      saveWorkoutProgress();
    }
  }, [selectedExercises]);

  // Load saved data
  const loadData = async () => {
    setExercises(SAMPLE_EXERCISES);
    
    try {
      const savedWorkout = await AsyncStorage.getItem('currentWorkout');
      if (savedWorkout) {
        const parsedWorkout = JSON.parse(savedWorkout);
        setSelectedExercises(parsedWorkout.exercises || []);
        setWorkoutDuration(parsedWorkout.duration || 0);
        if (parsedWorkout.exercises && parsedWorkout.exercises.length > 0) {
          setTimerActive(true);
          setActiveTab('workout');
        }
      }
    } catch (error) {
      console.error('Error loading saved workout:', error);
    }
    
    try {
      const savedHistory = await AsyncStorage.getItem('workoutHistory');
      if (savedHistory) {
        setWorkoutHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading workout history:', error);
    }
  };

  // Save current workout progress
  const saveWorkoutProgress = async () => {
    if (selectedExercises.length === 0) return;
    
    try {
      const workoutData = {
        exercises: selectedExercises,
        duration: workoutDuration,
        date: new Date().toISOString(),
      };
      await AsyncStorage.setItem('currentWorkout', JSON.stringify(workoutData));
    } catch (error) {
      console.error('Error saving workout progress:', error);
    }
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Add an exercise to the workout
  const addExercise = (exercise) => {
    if (selectedExercises.length === 0) {
      setTimerActive(true);
    }
    
    // Generate unique ID for this instance
    const uniqueId = `${exercise.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setSelectedExercises(prev => [
      ...prev, 
      { 
        ...exercise,
        id: uniqueId, // Use unique ID
        originalId: exercise.id, // Keep original for reference
        sets: Array(exercise.sets).fill().map((_, index) => ({ 
          id: `${uniqueId}-set-${index}`,
          completed: false,
          weight: 0,
          actualReps: 0
        }))
      }
    ]);
    
    setActiveTab('workout');
  };

  // Remove an exercise from the workout
  const removeExercise = (id) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== id));
    
    if (selectedExercises.length <= 1) {
      setTimerActive(false);
    }
  };

  // Open weight/reps input modal for a set
  const openSetModal = (exercise, setIndex) => {
    setCurrentExercise(exercise);
    setCurrentSetIndex(setIndex);
    
    if (exercise.sets[setIndex].completed) {
      setWeight(exercise.sets[setIndex].weight.toString());
      setActualReps(exercise.sets[setIndex].actualReps.toString());
    } else {
      setWeight('');
      setActualReps(exercise.reps.toString());
    }
    
    setWeightModalVisible(true);
  };

  // Complete a set with weight and reps
  const completeSet = () => {
    if (!currentExercise) return;
    
    const updatedExercises = selectedExercises.map(ex => 
      ex.id === currentExercise.id 
        ? {
            ...ex,
            sets: ex.sets.map((set, idx) => 
              idx === currentSetIndex
                ? { 
                    completed: true, 
                    weight: parseFloat(weight) || 0, 
                    actualReps: parseInt(actualReps) || 0 
                  }
                : set
            )
          }
        : ex
    );
    
    setSelectedExercises(updatedExercises);
    setWeightModalVisible(false);
    
    setRestTimeRemaining(restTime);
    setRestTimerActive(true);
  };

  // Skip rest timer
  const skipRestTimer = () => {
    setRestTimerActive(false);
    setRestTimeRemaining(0);
  };

  // Finish the workout
  const finishWorkout = async () => {
    if (selectedExercises.length === 0) {
      Alert.alert('No Exercises', 'Add exercises to your workout first');
      return;
    }
    
    const incompleteSets = selectedExercises.some(ex => 
      ex.sets.some(set => !set.completed)
    );
    
    let alertMessage = 'Are you sure you want to finish this workout?';
    if (incompleteSets) {
      alertMessage = 'You have incomplete sets. Are you sure you want to finish this workout?';
    }
    
    Alert.alert(
      'Finish Workout',
      alertMessage,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Finish', 
          onPress: async () => {
            const completedSets = selectedExercises.reduce((total, ex) => 
              total + ex.sets.filter(set => set.completed).length, 0);
              
            const totalWeight = selectedExercises.reduce((total, ex) => 
              total + ex.sets.reduce((setTotal, set) => 
                setTotal + (set.completed ? set.weight * set.actualReps : 0), 0), 0);
                
            const workoutData = {
              id: new Date().getTime().toString(),
              type: activityType,
              duration: workoutDuration,
              date: new Date().toISOString(),
              exercises: selectedExercises,
              stats: {
                totalSets: completedSets,
                totalWeight: totalWeight,
                exercises: selectedExercises.length
              }
            };
            
            try {
              const newHistory = [workoutData, ...workoutHistory];
              await AsyncStorage.setItem('workoutHistory', JSON.stringify(newHistory));
              await AsyncStorage.removeItem('currentWorkout');
              
              navigation.navigate('Home', { newWorkout: workoutData });
            } catch (error) {
              console.error('Error saving workout history:', error);
              Alert.alert('Error', 'Could not save workout data');
            }
            
            setTimerActive(false);
            setRestTimerActive(false);
          }
        }
      ]
    );
  };

  // Toggle a day in the schedule
  const toggleScheduleDay = (scheduleId, day) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId
          ? { 
              ...schedule, 
              days: schedule.days.includes(day)
                ? schedule.days.filter(d => d !== day)
                : [...schedule.days, day]
            }
          : schedule
      )
    );
  };

  // Select a workout schedule
  const selectSchedule = (schedule) => {
    setCurrentSchedule(schedule.id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{activityType}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton, 
            activeTab === 'exercises' && [styles.activeTab, { borderColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('exercises')}
        >
          <Ionicons 
            name="barbell-outline" 
            size={22} 
            color={activeTab === 'exercises' ? colors.primary : colors.textSecondary} 
          />
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'exercises' ? colors.primary : colors.textSecondary }
            ]}
          >
            Exercises
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton, 
            activeTab === 'workout' && [styles.activeTab, { borderColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('workout')}
        >
          <Ionicons 
            name="timer-outline" 
            size={22} 
            color={activeTab === 'workout' ? colors.primary : colors.textSecondary} 
          />
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'workout' ? colors.primary : colors.textSecondary }
            ]}
          >
            Workout
          </Text>
          {selectedExercises.length > 0 && (
            <View style={[styles.tabBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.tabBadgeText}>{selectedExercises.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton, 
            activeTab === 'schedule' && [styles.activeTab, { borderColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('schedule')}
        >
          <Ionicons 
            name="calendar-outline" 
            size={22} 
            color={activeTab === 'schedule' ? colors.primary : colors.textSecondary} 
          />
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'schedule' ? colors.primary : colors.textSecondary }
            ]}
          >
            Schedule
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Render tab content */}
      {activeTab === 'exercises' && (
        <ExercisesTab
          exercises={exercises}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          addExercise={addExercise}
          colors={colors}
        />
      )}
      
      {activeTab === 'workout' && (
        <WorkoutTab
          selectedExercises={selectedExercises}
          workoutDuration={workoutDuration}
          timerActive={timerActive}
          setTimerActive={setTimerActive}
          restTimerActive={restTimerActive}
          restTimeRemaining={restTimeRemaining}
          formatTime={formatTime}
          skipRestTimer={skipRestTimer}
          removeExercise={removeExercise}
          openSetModal={openSetModal}
          finishWorkout={finishWorkout}
          setActiveTab={setActiveTab}
          colors={colors}
        />
      )}
      
      {activeTab === 'schedule' && (
        <ScheduleTab
          schedules={schedules}
          currentSchedule={currentSchedule}
          toggleScheduleDay={toggleScheduleDay}
          selectSchedule={selectSchedule}
          colors={colors}
        />
      )}
      
      {/* Weight/Reps Modal */}
      <WeightModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        currentExercise={currentExercise}
        currentSetIndex={currentSetIndex}
        weight={weight}
        setWeight={setWeight}
        actualReps={actualReps}
        setActualReps={setActualReps}
        restTime={restTime}
        setRestTime={setRestTime}
        onComplete={completeSet}
        colors={colors}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
  },
  tabBadge: {
    position: 'absolute',
    top: -5,
    right: '25%',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default GymWorkoutScreen;