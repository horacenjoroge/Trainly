// components/gym/WeightModal.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const WeightModal = ({
  visible,
  onClose,
  currentExercise,
  currentSetIndex,
  weight,
  setWeight,
  actualReps,
  setActualReps,
  restTime,
  setRestTime,
  onComplete,
  colors,
}) => {
  const restTimeOptions = [
    { value: 30, label: '30s' },
    { value: 60, label: '1m' },
    { value: 90, label: '1m 30s' },
    { value: 120, label: '2m' },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {currentExercise?.name} - Set {currentSetIndex + 1}
          </Text>
          
          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Weight (kg):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="Enter weight"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Reps:</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              value={actualReps}
              onChangeText={setActualReps}
              keyboardType="numeric"
              placeholder="Enter reps"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Rest timer:</Text>
            <View style={styles.restPickerContainer}>
              {restTimeOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.restTimeButton, 
                    { 
                      backgroundColor: restTime === option.value ? colors.primary : colors.background,
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => setRestTime(option.value)}
                >
                  <Text style={{ 
                    color: restTime === option.value ? '#FFFFFF' : colors.text 
                  }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[
                styles.modalButton, 
                { 
                  backgroundColor: colors.error + '20', 
                  borderColor: colors.error 
                }
              ]}
              onPress={onClose}
            >
              <Text style={{ color: colors.error }}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={onComplete}
            >
              <Text style={{ color: '#FFFFFF' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  restPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  restTimeButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
});

export default WeightModal;