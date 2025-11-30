// components/gym/WorkoutTab.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WorkoutTimer from './WorkoutTimer';
import RestTimer from './RestTimer';
import WorkoutStats from './WorkoutStats';
import ExerciseCard from './ExerciseCard';
import EmptyWorkoutState from './EmptyWorkoutState';
import WorkoutSummaryModal from './WorkoutSummaryModal';

const WorkoutTimer = ({ workoutDuration, timerActive, setTimerActive, formatTime, colors }) => (
  <View style={[styles.timerContainer, { backgroundColor: colors.primary + '15' }]}>
    <View style={styles.timerContent}>
      <View style={styles.timerInfo}>
        <Ionicons name="time-outline" size={20} color={colors.primary} />
        <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>Workout Time</Text>
      </View>
      <Text style={[styles.timerValue, { color: colors.primary }]}>{formatTime(workoutDuration)}</Text>
    </View>
    <TouchableOpacity 
      style={[styles.timerButton, { backgroundColor: timerActive ? colors.error : colors.primary }]}
      onPress={() => setTimerActive(!timerActive)}
    >
      <Ionicons 
        name={timerActive ? "pause" : "play"} 
        size={16} 
        color="#FFFFFF" 
      />
      <Text style={styles.timerButtonText}>
        {timerActive ? "Pause" : "Resume"}
      </Text>
    </TouchableOpacity>
  </View>
);

const RestTimer = ({ restTimerActive, restTimeRemaining, formatTime, skipRestTimer, colors }) => {
  if (!restTimerActive) return null;
  
  return (
    <View style={[styles.restTimerContainer, { backgroundColor: colors.secondary + '15' }]}>
      <View style={styles.restTimerContent}>
        <Ionicons name="cafe-outline" size={24} color={colors.secondary} />
        <View style={styles.restInfo}>
          <Text style={[styles.restLabel, { color: colors.textSecondary }]}>Rest Time</Text>
          <Text style={[styles.restValue, { color: colors.secondary }]}>
            {formatTime(restTimeRemaining)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.skipButton, { backgroundColor: colors.secondary }]}
          onPress={skipRestTimer}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const WorkoutStats = ({ selectedExercises, colors }) => {
  const totalSets = selectedExercises.reduce((total, ex) => total + ex.sets.length, 0);
  const completedSets = selectedExercises.reduce((total, ex) => 
    total + ex.sets.filter(set => set.completed).length, 0);
  const completionPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {selectedExercises.length}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {completedSets}/{totalSets}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sets</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {completionPercentage}%
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Complete</Text>
      </View>
    </View>
  );
};

const SetButton = ({ set, index, onPress, colors, isActive }) => (
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
);

const ExerciseCard = ({ item, removeExercise, openSetModal, getExerciseCompletion, colors }) => {
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
};

const EmptyWorkoutState = ({ setActiveTab, colors }) => (
  <View style={styles.emptyContainer}>
    <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '20' }]}>
      <Ionicons name="barbell-outline" size={48} color={colors.primary} />
    </View>
    <Text style={[styles.emptyTitle, { color: colors.text }]}>
      Ready to Start Working Out?
    </Text>
    <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
      Add exercises from the library to begin your workout session
    </Text>
    <TouchableOpacity
      style={[styles.addExercisesButton, { backgroundColor: colors.primary }]}
      onPress={() => setActiveTab('exercises')}
    >
      <Ionicons name="add" size={20} color="#FFFFFF" />
      <Text style={styles.addExercisesText}>Browse Exercises</Text>
    </TouchableOpacity>
  </View>
);

const WorkoutSummaryModal = ({ visible, onClose, onSave, workoutData, colors }) => {
  if (!workoutData) return null;

  const { duration, exercises, stats } = workoutData;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.summaryModal, { backgroundColor: colors.surface }]}>
          <View style={styles.summaryHeader}>
            <Ionicons name="trophy-outline" size={32} color={colors.primary} />
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              Workout Complete!
            </Text>
            <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
              Great job on finishing your workout
            </Text>
          </View>

          <View style={styles.summaryStats}>
            <View style={[styles.summaryStatItem, { backgroundColor: colors.background }]}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <Text style={[styles.summaryStatValue, { color: colors.text }]}>
                {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
              </Text>
              <Text style={[styles.summaryStatLabel, { color: colors.textSecondary }]}>
                Duration
              </Text>
            </View>
            <View style={[styles.summaryStatItem, { backgroundColor: colors.background }]}>
              <Ionicons name="fitness-outline" size={24} color={colors.primary} />
              <Text style={[styles.summaryStatValue, { color: colors.text }]}>
                {stats.totalSets}
              </Text>
              <Text style={[styles.summaryStatLabel, { color: colors.textSecondary }]}>
                Sets Completed
              </Text>
            </View>
            <View style={[styles.summaryStatItem, { backgroundColor: colors.background }]}>
              <Ionicons name="barbell-outline" size={24} color={colors.primary} />
              <Text style={[styles.summaryStatValue, { color: colors.text }]}>
                {Math.round(stats.totalWeight)}kg
              </Text>
              <Text style={[styles.summaryStatLabel, { color: colors.textSecondary }]}>
                Total Weight
              </Text>
            </View>
          </View>

          <ScrollView style={styles.exercisesList} showsVerticalScrollIndicator={false}>
            {exercises.map((exercise, index) => (
              <View key={`summary-${exercise.id}-${index}`} style={[styles.summaryExercise, { backgroundColor: colors.background }]}>
                <Text style={[styles.summaryExerciseName, { color: colors.text }]}>
                  {exercise.name}
                </Text>
                <View style={styles.summarySets}>
                  {exercise.sets.filter(set => set.completed).map((set, setIndex) => (
                    <Text key={setIndex} style={[styles.summarySetText, { color: colors.textSecondary }]}>
                      {set.weight}kg × {set.actualReps}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.summaryActions}>
            <TouchableOpacity
              style={[styles.summaryButton, styles.discardButton, { borderColor: colors.error }]}
              onPress={onClose}
            >
              <Text style={[styles.discardButtonText, { color: colors.error }]}>
                Discard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.summaryButton, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={onSave}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [workoutSummary, setWorkoutSummary] = useState(null);

  // Calculate completion percentage for an exercise
  const getExerciseCompletion = (exercise) => {
    if (!exercise.sets || exercise.sets.length === 0) return 0;
    const completedSets = exercise.sets.filter(set => set.completed).length;
    return (completedSets / exercise.sets.length) * 100;
  };

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

  const handleSaveWorkout = () => {
    setShowSummaryModal(false);
    finishWorkout();
  };

  const hasExercises = selectedExercises.length > 0;
  const canFinish = selectedExercises.some(ex => ex.sets.some(set => set.completed));

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
          <FlatList
            data={selectedExercises}
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
        onClose={() => setShowSummaryModal(false)}
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
  
  // Timer styles
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  timerContent: {
    flex: 1,
  },
  timerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  timerValue: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerButtonText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Rest timer styles
  restTimerContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  restTimerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  restValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Stats styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Exercise card styles
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
  
  // Progress styles
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
  
  // Sets styles
  setsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
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
  
  // Quick action button
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  addExercisesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
  },
  addExercisesText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
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
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  summaryModal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 24,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  summaryStatItem: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 8,
  },
  summaryStatLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  exercisesList: {
    paddingBottom: 16,
  },
  summaryExercise: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryExerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  summarySets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summarySetText: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  summaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  discardButton: {
    borderWidth: 2,
  },
  discardButtonText: {
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 6,
  },
});

export default WorkoutTab;