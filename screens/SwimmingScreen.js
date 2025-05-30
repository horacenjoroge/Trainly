// screens/SwimmingScreen.js - Updated to properly use SwimmingTracker component
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Import your existing header component
import TrainingHeader from '../components/Trainheader';

// Import the SwimmingTracker component
import { useSwimmingTracker } from '../components/training/SwimmingTracker';

export default function SwimmingScreen({ navigation, route }) {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Get activity type and user info
  const activityType = route.params?.activity || 'Swimming';
  const userId = 'current-user-id'; // Replace with your auth context
  
  // Use the SwimmingTracker hook
  const {
    tracker,
    duration,
    laps,
    totalDistance,
    poolLength,
    strokeType,
    isActive,
    isPaused,
    isResting,
    restTimeRemaining,
    completeLap,
    startRest,
    skipRest,
    updatePoolLength,
    updateStrokeType,
    getSwimmingStats,
    formatTime,
    formatDuration,
  } = useSwimmingTracker(userId);
  
  // Modal states
  const [showPoolSetup, setShowPoolSetup] = useState(false);
  const [showLapModal, setShowLapModal] = useState(false);
  const [strokeCount, setStrokeCount] = useState('');
  
  const strokeTypes = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Mixed'];
  const poolLengths = [25, 50, 33.33]; // Common pool lengths

  const handleStartPause = async () => {
    try {
      if (!isActive) {
        // Start swimming
        await tracker.start();
      } else if (isPaused) {
        // Resume swimming
        tracker.resume();
      } else {
        // Pause swimming
        tracker.pause();
      }
    } catch (error) {
      console.error('Error in start/pause:', error);
      Alert.alert('Error', 'Could not start/pause swimming session.');
    }
  };

  const handleCompleteLap = () => {
    if (!isActive || isResting) return;
    setShowLapModal(true);
  };

  const saveLap = () => {
    const lap = completeLap(parseInt(strokeCount) || 0);
    setStrokeCount('');
    setShowLapModal(false);
    
    // Start rest timer (optional)
    startRest(30); // 30 second rest
  };

  const handleFinish = async () => {
    if (laps.length === 0) {
      Alert.alert('No Laps', 'Complete at least one lap to save your swimming session.');
      return;
    }

    try {
      // Stop the tracker
      tracker.stop();
      
      // Save workout with all the enhanced data
      const workoutData = await tracker.saveWorkout();
      
      // Navigate back to TrainingSelection
      navigation.navigate('TrainingSelection', {
        newWorkout: workoutData,
        message: 'Swimming session completed!'
      });
      
    } catch (error) {
      console.error('Error finishing workout:', error);
      Alert.alert('Error', 'Could not save swimming session.');
    }
  };

  const stats = getSwimmingStats();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Use your existing header */}
      <TrainingHeader 
        activityType={activityType}
        timer={duration} // Now uses tracker duration
        theme={theme}
        isPaused={isPaused}
      />

      <ScrollView style={styles.content}>
        {/* Pool Setup */}
        <TouchableOpacity 
          style={[styles.poolSetupCard, { backgroundColor: colors.surface }]}
          onPress={() => setShowPoolSetup(true)}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="settings-outline" size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Pool Setup</Text>
          </View>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            {poolLength}m pool • {strokeType}
          </Text>
        </TouchableOpacity>

        {/* Swimming Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>🏊‍♂️ Swimming Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {laps.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Laps</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {totalDistance}m
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distance</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats ? Math.round(stats.avgSwolf) : '--'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg SWOLF</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats ? formatTime(Math.round(stats.pace100m)) : '--:--'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pace/100m</Text>
            </View>
          </View>
        </View>

        {/* Rest Timer */}
        {isResting && (
          <View style={[styles.restCard, { backgroundColor: colors.secondary + '20' }]}>
            <Text style={[styles.restTitle, { color: colors.secondary }]}>
              Rest Period
            </Text>
            <Text style={[styles.restTime, { color: colors.secondary }]}>
              {formatTime(restTimeRemaining)}
            </Text>
            <TouchableOpacity 
              style={[styles.skipRestButton, { backgroundColor: colors.secondary }]}
              onPress={skipRest}
            >
              <Text style={styles.skipRestText}>Skip Rest</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lap History */}
        {laps.length > 0 && (
          <View style={[styles.lapsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Lap History</Text>
            
            {laps.slice(-5).reverse().map((lap, index) => (
              <View key={lap.lapNumber} style={styles.lapItem}>
                <View style={styles.lapInfo}>
                  <Text style={[styles.lapNumber, { color: colors.primary }]}>
                    Lap {lap.lapNumber}
                  </Text>
                  <Text style={[styles.lapDetails, { color: colors.textSecondary }]}>
                    {lap.strokeType} • {lap.strokeCount} strokes
                  </Text>
                </View>
                <View style={styles.lapStats}>
                  <Text style={[styles.lapTime, { color: colors.text }]}>
                    {formatTime(lap.time)}
                  </Text>
                  <Text style={[styles.lapSwolf, { color: colors.textSecondary }]}>
                    SWOLF: {lap.swolf}
                  </Text>
                </View>
              </View>
            ))}
            
            {laps.length > 5 && (
              <Text style={[styles.moreIndicator, { color: colors.textSecondary }]}>
                ... and {laps.length - 5} more laps
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: !isActive ? colors.primary : isPaused ? colors.primary : colors.error }]}
          onPress={handleStartPause}
        >
          <Ionicons 
            name={!isActive ? "play" : isPaused ? "play" : "pause"} 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.controlButtonText}>
            {!isActive ? "Start" : isPaused ? "Resume" : "Pause"}
          </Text>
        </TouchableOpacity>

        {isActive && !isResting && (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.primary }]}
            onPress={handleCompleteLap}
          >
            <Ionicons name="flag" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Complete Lap</Text>
          </TouchableOpacity>
        )}

        {laps.length > 0 && (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.success || '#4CAF50' }]}
            onPress={handleFinish}
          >
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pool Setup Modal */}
      <Modal
        visible={showPoolSetup}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPoolSetup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Pool Setup</Text>
            
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Pool Length:</Text>
            <View style={styles.poolLengthButtons}>
              {poolLengths.map(length => (
                <TouchableOpacity
                  key={length}
                  style={[
                    styles.poolLengthButton,
                    poolLength === length && { backgroundColor: colors.primary },
                    { borderColor: colors.border }
                  ]}
                  onPress={() => updatePoolLength(length)}
                >
                  <Text style={[
                    styles.poolLengthText,
                    { color: poolLength === length ? '#FFFFFF' : colors.text }
                  ]}>
                    {length}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Stroke Type:</Text>
            <View style={styles.strokeButtons}>
              {strokeTypes.map(stroke => (
                <TouchableOpacity
                  key={stroke}
                  style={[
                    styles.strokeButton,
                    strokeType === stroke && { backgroundColor: colors.primary },
                    { borderColor: colors.border }
                  ]}
                  onPress={() => updateStrokeType(stroke)}
                >
                  <Text style={[
                    styles.strokeText,
                    { color: strokeType === stroke ? '#FFFFFF' : colors.text }
                  ]}>
                    {stroke}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowPoolSetup(false)}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Lap Completion Modal */}
      <Modal
        visible={showLapModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLapModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Complete Lap</Text>
            
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
              Stroke Count (optional):
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              value={strokeCount}
              onChangeText={setStrokeCount}
              keyboardType="numeric"
              placeholder="Enter stroke count"
              placeholderTextColor={colors.textSecondary}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.error + '20', borderColor: colors.error }]}
                onPress={() => setShowLapModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.error }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={saveLap}
              >
                <Text style={styles.modalButtonText}>Save Lap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  poolSetupCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  restCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  restTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  restTime: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  skipRestButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipRestText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  lapsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  lapInfo: {
    flex: 1,
  },
  lapNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  lapDetails: {
    fontSize: 12,
    fontWeight: '500',
  },
  lapStats: {
    alignItems: 'flex-end',
  },
  lapTime: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  lapSwolf: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreIndicator: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },
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
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  poolLengthButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  poolLengthButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  poolLengthText: {
    fontWeight: '600',
  },
  strokeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  strokeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    minWidth: '30%',
    alignItems: 'center',
  },
  strokeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});