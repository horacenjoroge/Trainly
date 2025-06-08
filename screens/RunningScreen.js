// screens/RunningScreen.js - Updated with real user authentication & API integration
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  Share, 
  Text, 
  TouchableOpacity, 
  Linking,
  SafeAreaView,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your existing components
import TrainingHeader from '../components/Trainheader';
import TrainingMap from '../components/Trainmap';
import TrainingStats from '../components/Trainingstats';
import TrainingControls from '../components/trainingcontrols';

// Import the enhanced RunningTracker
import { useRunningTracker } from '../components/training/RunningTracker';

export default function RunningScreen({ navigation, route }) {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Get activity type and user info
  const activityType = route.params?.activity || 'Running';
  const [userId, setUserId] = useState(null);
  
  // Get current user ID from AsyncStorage
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
        console.error('Error getting current user ID:', error);
        Alert.alert('Error', 'Authentication error. Please login again.');
        navigation.goBack();
      }
    };

    getCurrentUserId();
  }, [navigation]);
  
  // Use the enhanced RunningTracker hook only when we have userId
  const {
    tracker,
    duration,
    distance,
    currentPace,
    averagePace,
    currentSpeed,
    averageSpeed,
    maxSpeed,
    splits,
    elevation,
    gpsPoints,
    isActive,
    isPaused,
    formattedDuration,
    recordManualSplit,
    getRunningStats,
    formatPace,
    formatSpeed,
    formatDistance,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    saveWorkout,
  } = useRunningTracker(userId);
  
  // UI state
  const [showingSplits, setShowingSplits] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);

  // Update coordinates when GPS points change
  useEffect(() => {
    if (gpsPoints.length > 0) {
      const coords = gpsPoints.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));
      setCoordinates(coords);
      
      // Update current location to latest GPS point
      const latest = gpsPoints[gpsPoints.length - 1];
      setCurrentLocation({
        latitude: latest.latitude,
        longitude: latest.longitude,
      });
    }
  }, [gpsPoints]);

  // Don't render until we have userId
  if (!userId) {
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

  // Handle start/pause/resume
  const handleStartPause = async () => {
    try {
      if (!isActive) {
        // Start running
        const started = await startTracking();
        if (!started) {
          Alert.alert('Error', 'Could not start running session. Please check location permissions.');
        }
      } else if (isPaused) {
        // Resume running
        resumeTracking();
      } else {
        // Pause running
        pauseTracking();
      }
    } catch (error) {
      console.error('Error in start/pause:', error);
      Alert.alert('Error', 'Could not start/pause running session.');
    }
  };

  // Handle manual split
  const handleManualSplit = () => {
    if (!isActive || isPaused) return;
    
    const split = recordManualSplit();
    if (split) {
      Alert.alert(
        `🏃‍♂️ Split ${split.number}`,
        `Distance: ${formatDistance(split.distance)}\nTime: ${formatTime(split.time)}\nPace: ${formatPace(split.pace)}`,
        [{ text: 'Keep Going!' }],
        { cancelable: true }
      );
    }
  };

  // UPDATED: Handle finish workout with proper API integration
  const handleFinish = async () => {
    if (distance < 100) { // Less than 100 meters
      Alert.alert('Short Run', 'Run for at least 100 meters to save your session.');
      return;
    }

    try {
      // Stop the tracker and save workout
      stopTracking();
      const result = await saveWorkout();
      
      if (result.success) {
        // Show achievements if earned
        if (result.achievements && result.achievements.length > 0) {
          Alert.alert(
            '🎉 New Achievement!',
            `You earned: ${result.achievements.map(a => a.title).join(', ')}`,
            [{ text: 'Awesome!', style: 'default' }]
          );
        }
        
        // Navigate back with success
        navigation.navigate('TrainingSelection', {
          newWorkout: result.workout,
          achievementsEarned: result.achievements,
          message: result.message
        });
      } else {
        throw new Error('Failed to save workout');
      }
      
    } catch (error) {
      console.error('Error finishing workout:', error);
      Alert.alert(
        'Save Error', 
        'Could not save your running session. Would you like to try again?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Retry', onPress: handleFinish }
        ]
      );
    }
  };

  // Enhanced share with running metrics
  const shareRoute = async () => {
    try {
      if (distance === 0) {
        Alert.alert('No Data', 'Start your run to share route data.');
        return;
      }

      const stats = getRunningStats();
      const distanceKm = (distance / 1000).toFixed(2);
      const paceFormatted = formatPace(averagePace);
      const timeFormatted = formattedDuration;
      
      const message = `Just completed a ${distanceKm}km run in ${timeFormatted} at ${paceFormatted}/km pace! 🏃‍♂️\n\n` +
        `📊 Stats:\n` +
        `• ${splits.length} splits completed\n` +
        `• ${Math.round(elevation.gain)}m elevation gain\n` +
        `• ${Math.round(stats.caloriesEstimate)} calories burned\n` +
        `• Max speed: ${formatSpeed(maxSpeed)}`;

      await Share.share({
        message: message,
        title: `Running - ${distanceKm}km`
      });
    } catch (error) {
      Alert.alert('Error sharing route', error.message);
    }
  };

  // Helper function for formatting time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Your existing header */}
      <TrainingHeader 
        activityType={activityType}
        timer={duration}
        theme={theme}
        isPaused={isPaused}
      />
      
      {/* Your existing map - prominently displayed */}
      <TrainingMap
        currentLocation={currentLocation}
        coordinates={coordinates}
        theme={theme}
      />
      
      {/* Your existing basic stats */}
      <TrainingStats
        distance={distance / 1000} // Convert to km for display
        timer={duration}
        theme={theme}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Enhanced Running Metrics */}
        {isActive && (
          <View style={[styles.runningMetrics, { backgroundColor: colors.surface }]}>
            <Text style={[styles.metricsTitle, { color: colors.primary }]}>
              🏃‍♂️ Running Metrics
            </Text>
            
            {/* Main pace and speed row */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>CURRENT PACE</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  {formatPace(currentPace)}
                </Text>
                <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>/km</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>AVG PACE</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  {formatPace(averagePace)}
                </Text>
                <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>/km</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>SPEED</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  {currentSpeed.toFixed(1)}
                </Text>
                <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>km/h</Text>
              </View>
            </View>
            
            {/* Splits and elevation row */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>SPLITS</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  {splits.length}
                </Text>
                <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>laps</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>ELEVATION ↑</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  {Math.round(elevation.gain)}
                </Text>
                <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>m</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>MAX SPEED</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  {maxSpeed.toFixed(1)}
                </Text>
                <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>km/h</Text>
              </View>
            </View>
          </View>
        )}

        {/* Manual Split Button */}
        {isActive && !isPaused && (
          <View style={styles.splitButtonContainer}>
            <TouchableOpacity
              style={[styles.splitButton, { backgroundColor: colors.secondary }]}
              onPress={handleManualSplit}
            >
              <Ionicons name="flag-outline" size={20} color="#FFFFFF" />
              <Text style={styles.splitButtonText}>Record Split</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Splits Display */}
        {splits.length > 0 && (
          <View style={[styles.splitsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.splitsHeader}>
              <Text style={[styles.splitsTitle, { color: colors.text }]}>Recent Splits</Text>
              <TouchableOpacity onPress={() => setShowingSplits(!showingSplits)}>
                <Ionicons 
                  name={showingSplits ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
            </View>
            
            {showingSplits && (
              <View style={styles.splitsList}>
                {splits.slice(-3).reverse().map((split, index) => (
                  <View key={split.number} style={styles.splitItem}>
                    <Text style={[styles.splitNumber, { color: colors.primary }]}>
                      Split {split.number}
                    </Text>
                    <Text style={[styles.splitTime, { color: colors.text }]}>
                      {formatTime(split.time)}
                    </Text>
                    <Text style={[styles.splitPace, { color: colors.textSecondary }]}>
                      {formatPace(split.pace)}
                    </Text>
                  </View>
                ))}
                {splits.length > 3 && (
                  <Text style={[styles.moreSplits, { color: colors.textSecondary }]}>
                    ... and {splits.length - 3} more splits
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Enhanced Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, { 
            backgroundColor: !isActive ? colors.primary : isPaused ? colors.primary : colors.error 
          }]}
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

        {isActive && (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.warning || '#FF9800' }]}
            onPress={shareRoute}
          >
            <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Share</Text>
          </TouchableOpacity>
        )}

        {distance > 0 && (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.success || '#4CAF50' }]}
            onPress={handleFinish}
          >
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>
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
    flex: 1,
  },
  
  // Running metrics styles
  runningMetrics: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 10,
    fontWeight: '500',
  },
  
  // Split button styles
  splitButtonContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  splitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  splitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Splits display styles
  splitsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  splitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  splitsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  splitsList: {
    marginTop: 8,
  },
  splitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  splitNumber: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  splitTime: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  splitPace: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  moreSplits: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  
  // Control buttons styles
  controlsContainer: {
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
});