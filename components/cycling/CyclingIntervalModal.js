// components/cycling/CyclingIntervalModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * CyclingIntervalModal component - Modal for starting interval training.
 * 
 * @param {Object} props
 * @param {boolean} props.visible - Whether modal is visible
 * @param {string} props.intervalType - Selected interval type
 * @param {string} props.intervalDuration - Interval duration in seconds
 * @param {string} props.targetPower - Target power (optional)
 * @param {Array} props.intervalTypes - Array of interval type options
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.onIntervalTypeChange - Callback when interval type changes
 * @param {Function} props.onDurationChange - Callback when duration changes
 * @param {Function} props.onPowerChange - Callback when target power changes
 * @param {Function} props.onStart - Callback to start interval
 * @returns {JSX.Element} The rendered CyclingIntervalModal component
 */
const CyclingIntervalModal = React.memo(({
  visible,
  intervalType,
  intervalDuration,
  targetPower,
  intervalTypes,
  onClose,
  onIntervalTypeChange,
  onDurationChange,
  onPowerChange,
  onStart,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Start Interval</Text>
          
          <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
            Interval Type:
          </Text>
          <View style={styles.intervalTypes}>
            {intervalTypes.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.intervalTypeButton,
                  intervalType === type.value && { backgroundColor: type.color },
                  { borderColor: type.color }
                ]}
                onPress={() => onIntervalTypeChange(type.value)}
              >
                <Text style={[
                  styles.intervalTypeText,
                  { color: intervalType === type.value ? '#FFFFFF' : type.color }
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
            Duration (seconds):
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            value={intervalDuration}
            onChangeText={onDurationChange}
            keyboardType="numeric"
            placeholder="300 (5 minutes)"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
            Target Power (optional):
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            value={targetPower}
            onChangeText={onPowerChange}
            keyboardType="numeric"
            placeholder="250 watts"
            placeholderTextColor={colors.textSecondary}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.error + '20', borderColor: colors.error }]}
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, { color: colors.error }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={onStart}
            >
              <Text style={styles.modalButtonText}>Start Interval</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

CyclingIntervalModal.displayName = 'CyclingIntervalModal';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  intervalTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intervalTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
  },
  intervalTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CyclingIntervalModal;

