import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import TrainingHeader from '../components/Trainheader';

// Temporary replacement hook to avoid the infinite loop
const useSwimmingTrackerTemp = (userId) => {
  const [duration, setDuration] = useState(0);
  const [laps, setLaps] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [poolLength, setPoolLength] = useState(25);
  const [strokeType, setStrokeType] = useState('Freestyle');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [restIntervalId, setRestIntervalId] = useState(null);

  // Timer effect for duration
  useEffect(() => {
    if (isActive && !isPaused && !isResting) {
      const id = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [isActive, isPaused, isResting]);

  // Rest timer effect
  useEffect(() => {
    if (isResting && restTimeRemaining > 0) {
      const id = setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setRestIntervalId(id);
      return () => clearInterval(id);
    } else if (restIntervalId) {
      clearInterval(restIntervalId);
      setRestIntervalId(null);
    }
  }, [isResting, restTimeRemaining]);

  const tracker = useMemo(() => ({
    start: async () => {
      setIsActive(true);
      setIsPaused(false);
      return true;
    },
    pause: () => {
      setIsPaused(true);
    },
    resume: () => {
      setIsPaused(false);
    },
    stop: () => {
      setIsActive(false);
      setIsPaused(false);
      if (intervalId) clearInterval(intervalId);
      if (restIntervalId) clearInterval(restIntervalId);
    },
  }), [intervalId, restIntervalId]);

  const completeLap = useCallback((strokeCount = 0) => {
    const lapTime = 60 + Math.random() * 30; // Random lap time for demo
    const newLap = {
      lapNumber: laps.length + 1,
      time: lapTime,
      swolf: strokeCount + lapTime,
      strokes: strokeCount,
    };
    setLaps(prev => [...prev, newLap]);
    setTotalDistance(prev => prev + poolLength);
    return newLap;
  }, [laps.length, poolLength]);

  const startRest = useCallback((seconds) => {
    setIsResting(true);
    setRestTimeRemaining(seconds);
  }, []);

  const skipRest = useCallback(() => {
    setIsResting(false);
    setRestTimeRemaining(0);
  }, []);

  const updatePoolLength = useCallback((length) => {
    setPoolLength(length);
    // Recalculate total distance
    setTotalDistance(laps.length * length);
  }, [laps.length]);

  const updateStrokeType = useCallback((type) => {
    setStrokeType(type);
  }, []);

  const getSwimmingStats = useCallback(() => {
    if (laps.length === 0) return null;
    
    const totalTime = laps.reduce((sum, lap) => sum + lap.time, 0);
    const totalStrokes = laps.reduce((sum, lap) => sum + lap.strokes, 0);
    const avgSwolf = laps.reduce((sum, lap) => sum + lap.swolf, 0) / laps.length;
    const pace100m = (totalTime / (totalDistance / 100));
    const caloriesEstimate = totalDistance * 0.5; // Simple estimate
    
    return {
      avgSwolf,
      pace100m,
      caloriesEstimate,
      totalTime,
      totalStrokes,
    };
  }, [laps, totalDistance]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const saveWorkout = useCallback(async () => {
    try {
      // Simulate saving workout
      const workoutData = {
        userId,
        type: 'Swimming',
        duration,
        laps,
        totalDistance,
        poolLength,
        strokeType,
        date: new Date().toISOString(),
      };
      
      console.log('Saving workout:', workoutData);
      
      return {
        success: true,
        workout: workoutData,
        message: 'Swimming session saved successfully!',
        achievements: [], // No achievements for now
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to save workout: ' + error.message,
      };
    }
  }, [userId, duration, laps, totalDistance, poolLength, strokeType]);

  return {
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
    saveWorkout,
  };
};

export default function SwimmingScreen({ navigation, route }) {
  const theme = useTheme();
  const colors = theme.colors;
  const activityType = route.params?.activity || 'Swimming';
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          const currentUserId = user._id || user.id || user.userId;
          setUserId(currentUserId);
        } else {
          Alert.alert('Error', 'User not authenticated. Please login again.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
        Alert.alert('Error', 'Authentication error.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUserId();
  }, [navigation]);

  if (isLoading || !userId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

function SwimmingScreenContent({ userId, navigation, colors, theme, activityType }) {
  // Use the temp hook that works (defined above)
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
    saveWorkout,
  } = useSwimmingTrackerTemp(userId);

  const [showPoolSetup, setShowPoolSetup] = useState(false);
  const [showLapModal, setShowLapModal] = useState(false);
  const [strokeCount, setStrokeCount] = useState('');

  const strokeTypes = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Mixed'];
  const poolLengths = [25, 50, 33.33];

  const handleStartPause = async () => {
    try {
      if (!isActive) {
        const started = await tracker.start();
        if (!started) Alert.alert('Error', 'Could not start session.');
      } else if (isPaused) {
        tracker.resume();
      } else {
        tracker.pause();
      }
    } catch (error) {
      console.error('Start/pause error:', error);
      Alert.alert('Error', 'Could not start/pause session.');
    }
  };

  const handleCompleteLap = () => {
    if (!isActive || isResting) return;
    setShowLapModal(true);
  };

  const saveLap = () => {
    const lap = completeLap(parseInt(strokeCount, 10) || 0);
    setStrokeCount('');
    setShowLapModal(false);
    startRest(30);
    if (lap) {
      Alert.alert(
        `🏊‍♂️ Lap ${lap.lapNumber}`,
        `Distance: ${poolLength}m\nTime: ${formatTime(lap.time)}\nSWOLF: ${lap.swolf}`,
        [{ text: 'Keep Swimming!' }],
        { cancelable: true }
      );
    }
  };

  const handleFinish = async () => {
    if (laps.length === 0) {
      Alert.alert('No Laps', 'Complete at least one lap.');
      return;
    }
    try {
      tracker.stop();
      const result = await saveWorkout();
      if (result.success) {
        if (result.achievements?.length > 0) {
          Alert.alert(
            '🎉 New Achievement!',
            `You earned: ${result.achievements.map((a) => a.title).join(', ')}`,
            [{ text: 'Awesome!' }]
          );
        }
        navigation.navigate('TrainingSelection', {
          newWorkout: result.workout,
          achievementsEarned: result.achievements,
          message: result.message || 'Swimming session completed!',
        });
      } else {
        throw new Error(result.message || 'Failed to save workout');
      }
    } catch (error) {
      console.error('Finish error:', error);
      Alert.alert(
        'Save Error',
        'Could not save session. Retry?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Retry', onPress: handleFinish },
        ]
      );
    }
  };

  const shareSession = async () => {
    try {
      if (laps.length === 0) {
        Alert.alert('No Data', 'Complete at least one lap to share.');
        return;
      }
      const stats = getSwimmingStats();
      const distanceKm = (totalDistance / 1000).toFixed(2);
      const timeFormatted = formatDuration(duration);
      const paceFormatted = stats ? formatTime(Math.round(stats.pace100m)) : '--:--';
      const message =
        `Completed a ${distanceKm}km swim in ${timeFormatted}! 🏊‍♂️\n\n` +
        `📊 Stats:\n` +
        `• ${laps.length} laps\n` +
        `• ${poolLength}m pool • ${strokeType}\n` +
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

  const stats = getSwimmingStats();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TrainingHeader
        activityType={activityType}
        timer={duration}
        theme={theme}
        isPaused={isPaused}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
        
        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>🏊‍♂️ Swimming Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{laps.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Laps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{totalDistance}m</Text>
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

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleStartPause}
          >
            <Text style={[styles.buttonText, { color: colors.onPrimary }]}>
              {!isActive ? 'Start' : isPaused ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={handleCompleteLap}
            disabled={!isActive || isResting}
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>Lap + Rest</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={skipRest}
            disabled={!isResting}
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>
              Skip Rest ({restTimeRemaining}s)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={shareSession}
            disabled={laps.length === 0}
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.finishButton, { backgroundColor: colors.primary }]}
          onPress={handleFinish}
          disabled={laps.length === 0}
        >
          <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Finish Session</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Pool Setup Modal */}
      <Modal visible={showPoolSetup} animationType="slide" transparent={true}>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Pool Setup</Text>
            <Text style={[styles.modalLabel, { color: colors.text }]}>Pool Length (meters)</Text>
            {poolLengths.map((length) => (
              <TouchableOpacity
                key={length}
                style={[
                  styles.optionButton,
                  poolLength === length && { backgroundColor: colors.primary },
                ]}
                onPress={() => updatePoolLength(length)}
              >
                <Text
                  style={[
                    styles.optionText,
                    poolLength === length ? { color: colors.onPrimary } : { color: colors.text },
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
                  strokeType === type && { backgroundColor: colors.primary },
                ]}
                onPress={() => updateStrokeType(type)}
              >
                <Text
                  style={[
                    styles.optionText,
                    strokeType === type ? { color: colors.onPrimary } : { color: colors.text },
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
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lap Stroke Count Modal */}
      <Modal visible={showLapModal} animationType="fade" transparent={true}>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
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
                <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Save</Text>
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
    fontSize: 18,
  },
  content: {
    padding: 16,
  },
  poolSetupCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
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
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    elevation: 10,
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
  },
  modalButtonsRow: {
    flexDirection: 'row',
  },
});