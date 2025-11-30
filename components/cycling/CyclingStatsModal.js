// components/cycling/CyclingStatsModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * CyclingStatsModal component - Modal displaying detailed cycling statistics.
 * 
 * @param {Object} props
 * @param {boolean} props.visible - Whether modal is visible
 * @param {Object} props.stats - Statistics object with various metrics
 * @param {Function} props.formatSpeed - Function to format speed
 * @param {Function} props.formatElevation - Function to format elevation
 * @param {Function} props.onClose - Callback to close modal
 * @returns {JSX.Element} The rendered CyclingStatsModal component
 */
const CyclingStatsModal = React.memo(({ visible, stats, formatSpeed, formatElevation, onClose }) => {
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
          <Text style={[styles.modalTitle, { color: colors.text }]}>Detailed Statistics</Text>
          
          <ScrollView style={styles.statsModalContent}>
            <View style={styles.statRow}>
              <Text style={[styles.statRowLabel, { color: colors.textSecondary }]}>
                Moving Time:
              </Text>
              <Text style={[styles.statRowValue, { color: colors.text }]}>
                {Math.floor(stats.movingTime / 60)}:{(stats.movingTime % 60).toString().padStart(2, '0')}
              </Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={[styles.statRowLabel, { color: colors.textSecondary }]}>
                Average Moving Speed:
              </Text>
              <Text style={[styles.statRowValue, { color: colors.text }]}>
                {formatSpeed(stats.avgMovingSpeed)}
              </Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={[styles.statRowLabel, { color: colors.textSecondary }]}>
                Total Elevation Change:
              </Text>
              <Text style={[styles.statRowValue, { color: colors.text }]}>
                {formatElevation(stats.totalElevationChange)}
              </Text>
            </View>
            
            {/* Add more detailed stats as needed */}
          </ScrollView>
          
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: colors.primary }]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

CyclingStatsModal.displayName = 'CyclingStatsModal';

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
    maxHeight: '80%',
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
  statsModalContent: {
    maxHeight: 300,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statRowLabel: {
    fontSize: 14,
    flex: 1,
  },
  statRowValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CyclingStatsModal;

