import React, { useState, useEffect } from 'react';
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
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log, logError } from '../utils/logger';
import TrainingHeader from '../components/Trainheader';

// Import the STABLE SwimmingTracker
import { useSwimmingTracker } from '../components/training/SwimmingTracker';

export default function SwimmingScreen({ navigation, route }) {
  const theme = useTheme();
  const colors = theme.colors;
  const activityType = route.params?.activity || 'Swimming';
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user ID from AsyncStorage - STABLE VERSION
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          const currentUserId = user._id || user.id || user.userId;
          log('SwimmingScreen - User ID loaded:', currentUserId);
          setUserId(currentUserId);
        } else {
          Alert.alert('Error', 'User not authenticated. Please login again.');
          navigation.goBack();
        }
      } catch (error) {
        logError('Error getting current user ID:', error);
        Alert.alert('Error', 'Authentication error. Please login again.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUserId();
  }, []); // Empty dependency array - only run once

  // Show loading until we have userId
  if (isLoading || !userId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render main content only when userId is ready
  return (
    <SwimmingScreenContent
      userId={userId}
      navigation={navigation}
      colors={colors}
      theme={theme}
      activityType={activityType}
    />
  );
}

// SEPARATE COMPONENT to isolate the tracker usage
function SwimmingScreenContent({ userId, navigation, colors, theme, activityType }) {
  // Use the STABLE SwimmingTracker hook
  const swimming = useSwimmingTracker(userId);

  // Local UI state - MINIMAL to prevent loops
  const [showPoolSetup, setShowPoolSetup] = useState(false);
  const [showLapModal, setShowLapModal] = useState(false);
  const [strokeCount, setStrokeCount] = useState('');

  // Static data - won't cause re-renders
  const strokeTypes = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Mixed'];
  const poolLengths = [25, 50, 33.33];

  // STABLE EVENT HANDLERS - No dependencies that change
  const handleStartPause = async () => {
    try {
      if (!swimming.isActive) {
        console.log('SwimmingScreen - Starting tracking...');
        const started = await swimming.startTracking();
        if (!started) {
          Alert.alert('Error', 'Could not start swimming session.');
        } else {
          log('SwimmingScreen - Tracking started successfully');
        }
      } else if (swimming.isPaused) {
        log('SwimmingScreen - Resuming tracking...');
        swimming.resumeTracking();
      } else {
        log('SwimmingScreen - Pausing tracking...');
        swimming.pauseTracking();
      }
    } catch (error) {
      logError('Error in start/pause:', error);
      Alert.alert('Error', 'Could not start/pause swimming session.');
    }
  };

  const handleCompleteLap = () => {
    if (!swimming.isActive || swimming.isResting) return;
    setShowLapModal(true);
  };

  const saveLap = () => {
    const lap = swimming.completeLap(parseInt(strokeCount, 10) || 0);
    setStrokeCount('');
    setShowLapModal(false);
    swimming.startRest(30);
    
    if (lap) {
      Alert.alert(
        `🏊‍♂️ Lap ${lap.lapNumber}`,
        `Distance: ${swimming.poolLength}m\nTime: ${swimming.formatTime(lap.time)}\nSWOLF: ${lap.swolf}`,
        [{ text: 'Keep Swimming!' }],
        { cancelable: true }
      );
    }
  };

  // SIMPLIFIED handleFinish - No complex state dependencies
  const handleFinish = async () => {
    console.log('=== SWIMMING WORKOUT FINISH DEBUG START ===');
    console.log('Total Distance:', swimming.totalDistance, 'meters');
    console.log('Duration:', swimming.duration, 'seconds');
    console.log('Total Laps:', swimming.laps.length);

    // Simple validation
    if (swimming.laps.length === 0 && !__DEV__) {
      Alert.alert('No Laps', 'Complete at least one lap to save your session.');
      return;
    }

    // Duration fix
    const MINIMUM_DURATION = 30;
    if (swimming.duration < MINIMUM_DURATION && swimming.tracker) {
      console.log(`Duration too short (${swimming.duration}s), adjusting to ${MINIMUM_DURATION}s`);
      swimming.tracker.duration = MINIMUM_DURATION;
      swimming.tracker.endTime = new Date(swimming.tracker.startTime.getTime() + (MINIMUM_DURATION * 1000));
    }

    try {
      console.log('SwimmingScreen - Stopping tracker...');
      swimming.stopTracking();
      
      console.log('SwimmingScreen - About to save workout...');
      const result = await swimming.saveWorkout();
      
      if (result && result.success) {
        console.log('SwimmingScreen - Workout saved successfully!');
        
        if (result.achievements && result.achievements.length > 0) {
          Alert.alert(
            '🎉 New Achievement!',
            `You earned: ${result.achievements.map(a => a.title || a.name || 'Achievement').join(', ')}`,
            [{ text: 'Awesome!' }]
          );
        }
        
        navigation.navigate('TrainingSelection', {
          newWorkout: result.workout,
          achievementsEarned: result.achievements,
          message: result.message || 'Swimming session completed!'
        });
      } else {
        throw new Error(result?.message || 'Failed to save workout');
      }
    } catch (error) {
      console.error('SwimmingScreen - ERROR in handleFinish:', error.message);
      Alert.alert(
        'Save Error',
        `Could not save your swimming session: ${error.message}. Would you like to try again?`,
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Retry', onPress: handleFinish }
        ]
      );
    } finally {
      console.log('=== SWIMMING WORKOUT FINISH DEBUG END ===');
    }
  };

  const shareSession = async () => {
    try {
      if (swimming.laps.length === 0) {
        Alert.alert('No Data', 'Complete at least one lap to share.');
        return;
      }
      
      const stats = swimming.getSwimmingStats();
      const distanceKm = (swimming.totalDistance / 1000).toFixed(2);
      const timeFormatted = swimming.formatDuration(swimming.duration);
      const paceFormatted = stats ? swimming.formatTime(Math.round(stats.pace100m)) : '--:--';
      
      const message =
        `Completed a ${distanceKm}km swim in ${timeFormatted}! 🏊‍♂️\n\n` +
        `📊 Stats:\n` +
        `• ${swimming.laps.length} laps\n` +
        `• ${swimming.poolLength}m pool • ${swimming.strokeType}\n` +
        `• Avg SWOLF: ${stats ? Math.round(stats.avgSwolf) : '--'}\n` +
        `• Pace/100m: ${paceFormatted}\n` +
        `• Calories: ${stats ? Math.round(stats.caloriesEstimate) : '--'}`;
        
      await Share.share({
        message,
        title: `Swimming - ${distanceKm}km`,
      });
    } catch (error) {
      Alert.alert('Error sharing', error.message);
    }
  };

  // Get stats once, don't recalculate constantly
  const stats = swimming.getSwimmingStats();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TrainingHeader
        activityType={activityType}
        timer={swimming.duration}
        theme={theme}
        isPaused={swimming.isPaused}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pool Setup Card */}
        <TouchableOpacity
          style={[styles.poolSetupCard, { backgroundColor: colors.surface }]}
          onPress={() => setShowPoolSetup(true)}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="settings-outline" size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Pool Setup</Text>
          </View>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            {swimming.poolLength}m pool • {swimming.strokeType}
          </Text>
        </TouchableOpacity>
        
        {/* Swimming Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>🏊‍♂️ Swimming Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{swimming.laps.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Laps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{swimming.totalDistance}m</Text>
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
                {stats ? swimming.formatTime(Math.round(stats.pace100m)) : '--:--'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pace / 100m</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats ? Math.round(stats.caloriesEstimate) : '--'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calories</Text>
            </View>
          </View>
        </View>

        {/* Rest Status */}
        {swimming.isResting && (
          <View style={[styles.restCard, { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}>
            <View style={styles.restHeader}>
              <Ionicons name="pause-circle" size={24} color={colors.warning} />
              <Text style={[styles.restTitle, { color: colors.warning }]}>Rest Period</Text>
            </View>
            <Text style={[styles.restTime, { color: colors.warning }]}>
              {swimming.restTimeRemaining}s remaining
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.primaryButton, { 
              backgroundColor: !swimming.isActive ? colors.primary : swimming.isPaused ? colors.primary : colors.error 
            }]}
            onPress={handleStartPause}
          >
            <Ionicons 
              name={!swimming.isActive ? "play" : swimming.isPaused ? "play" : "pause"} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
              {!swimming.isActive ? 'Start' : swimming.isPaused ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={handleCompleteLap}
            disabled={!swimming.isActive || swimming.isResting}
          >
            <Ionicons name="flag-outline" size={20} color={colors.primary} />
            <Text style={[styles.buttonText, { color: colors.primary }]}>Lap + Rest</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={() => swimming.skipRest()}
            disabled={!swimming.isResting}
          >
            <Ionicons name="play-skip-forward" size={20} color={colors.primary} />
            <Text style={[styles.buttonText, { color: colors.primary }]}>
              Skip Rest ({swimming.restTimeRemaining}s)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={shareSession}
            disabled={swimming.laps.length === 0}
          >
            <Ionicons name="share-outline" size={20} color={colors.primary} />
            <Text style={[styles.buttonText, { color: colors.primary }]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Finish Button */}
        <TouchableOpacity
          style={[styles.finishButton, { backgroundColor: colors.success || '#4CAF50' }]}
          onPress={handleFinish}
          disabled={!swimming.isActive && swimming.laps.length === 0 && !__DEV__}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={[styles.buttonText, { color: "#FFFFFF", marginLeft: 8 }]}>
            Finish Session
          </Text>
        </TouchableOpacity>

        {/* Recent Laps Display */}
        {swimming.laps.length > 0 && (
          <View style={[styles.lapsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Laps</Text>
            {swimming.laps.slice(-3).reverse().map((lap) => (
              <View key={lap.lapNumber} style={styles.lapItem}>
                <Text style={[styles.lapNumber, { color: colors.primary }]}>
                  Lap {lap.lapNumber}
                </Text>
                <Text style={[styles.lapTime, { color: colors.text }]}>
                  {swimming.formatTime(lap.time)}
                </Text>
                <Text style={[styles.lapSwolf, { color: colors.textSecondary }]}>
                  SWOLF: {lap.swolf}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Pool Setup Modal */}
      <Modal visible={showPoolSetup} animationType="slide" transparent={true}>
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Pool Setup</Text>
            
            <Text style={[styles.modalLabel, { color: colors.text }]}>Pool Length (meters)</Text>
            {poolLengths.map((length) => (
              <TouchableOpacity
                key={length}
                style={[
                  styles.optionButton,
                  { borderColor: colors.primary },
                  swimming.poolLength === length && { backgroundColor: colors.primary },
                ]}
                onPress={() => swimming.updatePoolLength(length)}
              >
                <Text
                  style={[
                    styles.optionText,
                    swimming.poolLength === length ? { color: '#FFFFFF' } : { color: colors.text },
                  ]}
                >
                  {length} m
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={[styles.modalLabel, { color: colors.text }]}>Stroke Type</Text>
            {strokeTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  { borderColor: colors.primary },
                  swimming.strokeType === type && { backgroundColor: colors.primary },
                ]}
                onPress={() => swimming.updateStrokeType(type)}
              >
                <Text
                  style={[
                    styles.optionText,
                    swimming.strokeType === type ? { color: '#FFFFFF' } : { color: colors.text },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowPoolSetup(false)}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lap Stroke Count Modal */}
      <Modal visible={showLapModal} animationType="fade" transparent={true}>
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Enter Stroke Count</Text>
            <TextInput
              style={[styles.textInput, { color: colors.text, borderColor: colors.primary }]}
              keyboardType="number-pad"
              placeholder="e.g. 20"
              placeholderTextColor={colors.textSecondary}
              value={strokeCount}
              onChangeText={setStrokeCount}
              maxLength={3}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: colors.primary, flex: 1, marginRight: 5 }]}
                onPress={() => {
                  setStrokeCount('');
                  setShowLapModal(false);
                }}
              >
                <Text style={[styles.buttonText, { color: colors.primary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: colors.primary, flex: 1, marginLeft: 5 }]}
                onPress={saveLap}
              >
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Save</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  poolSetupCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  statsCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statItem: {
    width: '30%',
    marginBottom: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  restCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  restHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  restTime: {
    fontSize: 24,
    fontWeight: '700',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  finishButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  lapsCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
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
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  lapNumber: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  lapTime: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  lapSwolf: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  textInput: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  modalButtonsRow: {
    flexDirection: 'row',
  },
});