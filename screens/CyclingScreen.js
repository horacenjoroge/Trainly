// screens/CyclingScreen.js - Enhanced Cycling Workout Screen
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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useTheme } from '../context/ThemeContext';

// Import your existing header component
import TrainingHeader from '../components/Trainheader';

// Import the CyclingTracker component
import { useCyclingTracker } from '../components/training/CyclingTracker';

const { width } = Dimensions.get('window');

export default function CyclingScreen({ navigation, route }) {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Get activity type and user info
  const activityType = route.params?.activity || 'Cycling';
  const userId = 'current-user-id'; // Replace with your auth context
  
  // Use the CyclingTracker hook
  const {
    tracker,
    duration,
    distance,
    currentSpeed,
    avgSpeed,
    maxSpeed,
    elevation,
    route: cyclingRoute,
    segments,
    intervals,
    currentLocation,
    isActive,
    isPaused,
    formattedDuration,
    startInterval,
    finishSegment,
    getCyclingStats,
    formatDistance,
    formatSpeed,
    formatElevation,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    saveWorkout,
  } = useCyclingTracker(userId);
  
  // Modal and UI states
  const [showIntervalModal, setShowIntervalModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [intervalType, setIntervalType] = useState('work');
  const [intervalDuration, setIntervalDuration] = useState('300');
  const [targetPower, setTargetPower] = useState('');
  const [mapRegion, setMapRegion] = useState(null);
  const [showMap, setShowMap] = useState(true);

  // Set initial map region when location is available
  useEffect(() => {
    if (currentLocation && !mapRegion) {
      setMapRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [currentLocation]);

  // Update map region to follow user
  useEffect(() => {
    if (currentLocation && isActive) {
      setMapRegion(prev => prev ? {
        ...prev,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      } : {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [currentLocation, isActive]);

  const handleStartPause = async () => {
    try {
      if (!isActive) {
        // Start cycling
        const started = await startTracking();
        if (!started) {
          Alert.alert('Error', 'Could not start cycling session. Please check location permissions.');
        }
      } else if (isPaused) {
        // Resume cycling
        resumeTracking();
      } else {
        // Pause cycling
        pauseTracking();
      }
    } catch (error) {
      console.error('Error in start/pause:', error);
      Alert.alert('Error', 'Could not start/pause cycling session.');
    }
  };

  const handleStartInterval = () => {
    const interval = startInterval(
      intervalType,
      parseInt(intervalDuration),
      targetPower ? parseInt(targetPower) : null
    );
    
    setShowIntervalModal(false);
    setIntervalDuration('300');
    setTargetPower('');
    
    Alert.alert(
      'Interval Started',
      `${intervalType.toUpperCase()} interval for ${Math.floor(parseInt(intervalDuration) / 60)} minutes started!`
    );
  };

  const handleFinish = async () => {
    if (distance < 100) { // Less than 100 meters
      Alert.alert('Short Ride', 'Ride for at least 100 meters to save your cycling session.');
      return;
    }

    try {
      // Stop the tracker
      stopTracking();
      
      // Save workout with all the enhanced data
      const workoutData = await saveWorkout();
      
      // Navigate back to TrainingSelection
      navigation.navigate('TrainingSelection', {
        newWorkout: workoutData,
        message: 'Cycling session completed!'
      });
      
    } catch (error) {
      console.error('Error finishing workout:', error);
      Alert.alert('Error', 'Could not save cycling session.');
    }
  };

  const stats = getCyclingStats();
  const intervalTypes = [
    { value: 'work', label: 'Work Interval', color: colors.error },
    { value: 'rest', label: 'Rest Interval', color: colors.primary },
    { value: 'warmup', label: 'Warm Up', color: colors.warning },
    { value: 'cooldown', label: 'Cool Down', color: colors.success },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Use your existing header */}
      <TrainingHeader 
        activityType={activityType}
        timer={duration}
        theme={theme}
        isPaused={isPaused}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map View */}
        {showMap && mapRegion && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
              showsUserLocation={true}
              showsMyLocationButton={false}
              followsUserLocation={isActive}
              mapType="standard"
            >
              {/* Route polyline */}
              {cyclingRoute.length > 1 && (
                <Polyline
                  coordinates={cyclingRoute.map(point => ({
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }))}
                  strokeColor={colors.primary}
                  strokeWidth={4}
                />
              )}
              
              {/* Start marker */}
              {cyclingRoute.length > 0 && (
                <Marker
                  coordinate={{
                    latitude: cyclingRoute[0].latitude,
                    longitude: cyclingRoute[0].longitude,
                  }}
                  title="Start"
                  pinColor="green"
                />
              )}
              
              {/* Current location marker */}
              {currentLocation && (
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  title="Current Location"
                  pinColor={colors.primary}
                />
              )}
            </MapView>
            
            {/* Map toggle button */}
            <TouchableOpacity
              style={[styles.mapToggle, { backgroundColor: colors.surface }]}
              onPress={() => setShowMap(false)}
            >
              <Ionicons name="contract-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Map toggle when hidden */}
        {!showMap && (
          <TouchableOpacity
            style={[styles.mapToggleExpand, { backgroundColor: colors.surface }]}
            onPress={() => setShowMap(true)}
          >
            <Ionicons name="map-outline" size={20} color={colors.primary} />
            <Text style={[styles.mapToggleText, { color: colors.text }]}>Show Map</Text>
          </TouchableOpacity>
        )}

        {/* Main Stats Card */}
        <View style={[styles.mainStatsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.mainStatsGrid}>
            <View style={styles.mainStatItem}>
              <Text style={[styles.mainStatNumber, { color: colors.primary }]}>
                {formatSpeed(currentSpeed)}
              </Text>
              <Text style={[styles.mainStatLabel, { color: colors.textSecondary }]}>
                Current Speed
              </Text>
            </View>
            
            <View style={styles.mainStatItem}>
              <Text style={[styles.mainStatNumber, { color: colors.primary }]}>
                {formatDistance(distance)}
              </Text>
              <Text style={[styles.mainStatLabel, { color: colors.textSecondary }]}>
                Distance
              </Text>
            </View>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>🚴‍♂️ Performance</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {formatSpeed(avgSpeed)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Speed</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {formatSpeed(maxSpeed)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Max Speed</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {formatElevation(elevation.gain)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Elevation ↗</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {Math.round(stats.totalTime / 60)}min
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Time</Text>
            </View>
          </View>
        </View>

        {/* Elevation Card */}
        <View style={[styles.elevationCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>📈 Elevation</Text>
          
          <View style={styles.elevationStats}>
            <View style={styles.elevationItem}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
              <Text style={[styles.elevationValue, { color: colors.text }]}>
                {formatElevation(elevation.gain)}
              </Text>
              <Text style={[styles.elevationLabel, { color: colors.textSecondary }]}>
                Gain
              </Text>
            </View>
            
            <View style={styles.elevationItem}>
              <Ionicons name="trending-down" size={20} color="#FF5722" />
              <Text style={[styles.elevationValue, { color: colors.text }]}>
                {formatElevation(elevation.loss)}
              </Text>
              <Text style={[styles.elevationLabel, { color: colors.textSecondary }]}>
                Loss
              </Text>
            </View>
            
            <View style={styles.elevationItem}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <Text style={[styles.elevationValue, { color: colors.text }]}>
                {formatElevation(elevation.current)}
              </Text>
              <Text style={[styles.elevationLabel, { color: colors.textSecondary }]}>
                Current
              </Text>
            </View>
          </View>
        </View>

        {/* Intervals & Segments */}
        {(intervals.length > 0 || segments.length > 0) && (
          <View style={[styles.segmentsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>📊 Activity</Text>
              <TouchableOpacity onPress={() => setShowStatsModal(true)}>
                <Ionicons name="stats-chart-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.activityStats}>
              <View style={styles.activityItem}>
                <Text style={[styles.activityNumber, { color: colors.primary }]}>
                  {segments.length}
                </Text>
                <Text style={[styles.activityLabel, { color: colors.textSecondary }]}>
                  Segments
                </Text>
              </View>
              
              <View style={styles.activityItem}>
                <Text style={[styles.activityNumber, { color: colors.primary }]}>
                  {intervals.length}
                </Text>
                <Text style={[styles.activityLabel, { color: colors.textSecondary }]}>
                  Intervals
                </Text>
              </View>
            </View>
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

        {isActive && (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.warning || '#FF9800' }]}
            onPress={() => setShowIntervalModal(true)}
          >
            <Ionicons name="timer-outline" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Interval</Text>
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

      {/* Interval Training Modal */}
      <Modal
        visible={showIntervalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowIntervalModal(false)}
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
                  onPress={() => setIntervalType(type.value)}
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
              onChangeText={setIntervalDuration}
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
              onChangeText={setTargetPower}
              keyboardType="numeric"
              placeholder="250 watts"
              placeholderTextColor={colors.textSecondary}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.error + '20', borderColor: colors.error }]}
                onPress={() => setShowIntervalModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.error }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleStartInterval}
              >
                <Text style={styles.modalButtonText}>Start Interval</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detailed Stats Modal */}
      <Modal
        visible={showStatsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStatsModal(false)}
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
              onPress={() => setShowStatsModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
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
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  mapToggleExpand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mapToggleText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  mainStatsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mainStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mainStatItem: {
    alignItems: 'center',
  },
  mainStatNumber: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  mainStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  elevationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  elevationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  elevationItem: {
    alignItems: 'center',
  },
  elevationValue: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 4,
  },
  elevationLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  segmentsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activityItem: {
    alignItems: 'center',
  },
  activityNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
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
    maxHeight: '80%',
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
  intervalTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  intervalTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  intervalTypeText: {
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
    marginTop: 20,
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
  statsModalContent: {
    maxHeight: 300,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  statRowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statRowValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});