// components/gym/WorkoutSummaryModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * WorkoutSummaryModal component - Modal displaying workout completion summary.
 * 
 * @param {Object} props
 * @param {boolean} props.visible - Whether modal is visible
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.onSave - Callback to save workout
 * @param {Object} props.workoutData - Workout data object with duration, exercises, stats
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element | null} The rendered WorkoutSummaryModal component or null if no data
 */
const WorkoutSummaryModal = React.memo(({ visible, onClose, onSave, workoutData, colors }) => {
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
});

WorkoutSummaryModal.displayName = 'WorkoutSummaryModal';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryModal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
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
    flex: 1,
    marginHorizontal: 4,
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  exercisesList: {
    maxHeight: 200,
    marginBottom: 20,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  summaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  discardButton: {
    borderWidth: 2,
  },
  saveButton: {
    // backgroundColor set inline
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default WorkoutSummaryModal;

