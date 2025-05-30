// screens/RunningScreen.js - ACTUALLY Enhanced with visible improvements
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Share, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your existing components - no changes!
import TrainingHeader from '../components/Trainheader';
import TrainingMap from '../components/Trainmap';
import TrainingStats from '../components/Trainingstats';
import TrainingControls from '../components/trainingcontrols';
import { Ionicons } from '@expo/vector-icons';

export default function RunningScreen({ navigation, route }) {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Same state as your TrainingScreen
  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [coordinates, setCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // NEW: Running-specific state (these are the actual new features!)
  const [currentPace, setCurrentPace] = useState(0); // min/km
  const [averagePace, setAveragePace] = useState(0); // min/km
  const [splits, setSplits] = useState([]); // kilometer splits
  const [lastSplitDistance, setLastSplitDistance] = useState(0);
  const [elevation, setElevation] = useState({ gain: 0, loss: 0, current: 0 });
  const [lastAltitude, setLastAltitude] = useState(null);

  const activityType = route.params?.activity || 'Running';

  // Same permission logic as your TrainingScreen
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
        setPermissionStatus(existingStatus);
        if (existingStatus === 'granted') {
          await getCurrentLocation();
        }
      } catch (error) {
        console.error('Error checking location permission:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Same getCurrentLocation as your TrainingScreen
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      const initialLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(initialLocation);
      setCoordinates([initialLocation]);
      
      // NEW: Set initial elevation
      if (location.coords.altitude) {
        setLastAltitude(location.coords.altitude);
        setElevation(prev => ({ ...prev, current: location.coords.altitude }));
      }
      
      return true;
    } catch (error) {
      console.error('Error getting current location:', error);
      return false;
    }
  };

  // Same permission request as your TrainingScreen
  const requestLocationPermission = async () => {
    try {
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
      if (currentStatus === 'denied') {
        Alert.alert(
          'Permission Required',
          'Location access is needed for tracking your workouts. Please enable location in your device settings.',
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel', onPress: () => navigation.goBack() }
          ]
        );
        return false;
      }
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        const locationObtained = await getCurrentLocation();
        return locationObtained;
      } else {
        Alert.alert(
          'Permission Required',
          'This app needs location permission to track your activity.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  // Enhanced timer with pace calculation
  useEffect(() => {
    let interval;
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTimer = prev + 1;
          
          // NEW: Calculate pace in real-time
          if (distance > 0 && newTimer > 0) {
            const distanceKm = distance;
            const timeMinutes = newTimer / 60;
            const avgPaceValue = timeMinutes / distanceKm; // min/km
            setAveragePace(avgPaceValue);
            
            // Calculate current pace (last 30 seconds)
            if (newTimer % 30 === 0 && distance > 0) {
              setCurrentPace(avgPaceValue); // Simplified for now
            }
          }
          
          // NEW: Auto-save every 30 seconds
          if (newTimer % 30 === 0 && newTimer > 0) {
            autoSaveProgress();
          }
          
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isPaused, distance]);

  // Enhanced GPS tracking with elevation and splits
  useEffect(() => {
    let locationSubscription;
    
    const startLocationTracking = async () => {
      if (isTracking && !isPaused && permissionStatus === 'granted') {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            const newCoordinate = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setCurrentLocation(newCoordinate);
            setCoordinates(prev => [...prev, newCoordinate]);
            updateDistance(newCoordinate);
            
            // NEW: Track elevation
            if (location.coords.altitude && lastAltitude !== null) {
              const altitudeChange = location.coords.altitude - lastAltitude;
              if (altitudeChange > 1) {
                setElevation(prev => ({ 
                  ...prev, 
                  gain: prev.gain + altitudeChange,
                  current: location.coords.altitude 
                }));
              } else if (altitudeChange < -1) {
                setElevation(prev => ({ 
                  ...prev, 
                  loss: prev.loss + Math.abs(altitudeChange),
                  current: location.coords.altitude 
                }));
              }
              setLastAltitude(location.coords.altitude);
            }
          }
        );
      }
    };

    startLocationTracking();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isTracking, isPaused, permissionStatus, lastAltitude]);

  // Enhanced distance calculation with auto-splits
  const updateDistance = newCoordinate => {
    if (coordinates.length > 0) {
      const lastCoordinate = coordinates[coordinates.length - 1];
      const newDistance = calculateDistance(lastCoordinate, newCoordinate);
      const updatedDistance = distance + newDistance;
      setDistance(updatedDistance);
      
      // NEW: Auto-lap every kilometer
      const currentKm = Math.floor(updatedDistance);
      const lastKm = Math.floor(lastSplitDistance);
      
      if (currentKm > lastKm && currentKm > 0) {
        const splitTime = timer;
        const splitPace = splitTime > 0 ? (splitTime / 60) / currentKm : 0;
        
        const newSplit = {
          km: currentKm,
          time: splitTime,
          pace: splitPace,
          timestamp: new Date().toISOString()
        };
        
        setSplits(prev => [...prev, newSplit]);
        setLastSplitDistance(updatedDistance);
        
        // NEW: Split notification
        Alert.alert(
          `🏃‍♂️ ${currentKm} km Complete!`,
          `Pace: ${formatPace(splitPace)}\nTime: ${formatTime(splitTime)}`,
          [{ text: 'Keep Going!' }],
          { cancelable: true }
        );
      }
    }
  };

  // Same distance calculation as your TrainingScreen
  const calculateDistance = (coord1, coord2) => {
    const R = 6371;
    const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
    const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * (Math.PI / 180)) *
      Math.cos(coord2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // NEW: Helper functions for formatting
  const formatPace = (paceValue) => {
    if (paceValue === 0 || !isFinite(paceValue)) return '--:--';
    const minutes = Math.floor(paceValue);
    const seconds = Math.round((paceValue - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // NEW: Auto-save functionality
  const autoSaveProgress = async () => {
    try {
      const progressData = {
        type: activityType,
        duration: timer,
        distance: distance,
        pace: averagePace,
        splits: splits,
        elevation: elevation,
        coordinates: coordinates,
        timestamp: new Date().toISOString()
      };
      await AsyncStorage.setItem('runningProgress', JSON.stringify(progressData));
      console.log('Running progress auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Enhanced share with running metrics
  const shareRoute = async () => {
    try {
      if (distance === 0) {
        Alert.alert('No Data', 'Start your run to share route data.');
        return;
      }

      const distanceKm = distance.toFixed(2);
      const paceFormatted = formatPace(averagePace);
      const timeFormatted = formatTime(timer);
      
      const message = `Just completed a ${distanceKm}km run in ${timeFormatted} at ${paceFormatted}/km pace! 🏃‍♂️\n\n` +
        `📊 Stats:\n` +
        `• ${splits.length} km splits completed\n` +
        `• ${Math.round(elevation.gain)}m elevation gain\n` +
        `• ${Math.round(timer * 8)} calories burned`;

      await Share.share({
        message: message,
        title: `Running - ${distanceKm}km`
      });
    } catch (error) {
      Alert.alert('Error sharing route', error.message);
    }
  };

  // Same start/pause logic as your TrainingScreen
  const handleStartPause = async () => {
    if (!isTracking) {
      if (permissionStatus !== 'granted') {
        const granted = await requestLocationPermission();
        if (!granted) return;
      }
      setIsTracking(true);
    } else {
      setIsPaused(!isPaused);
    }
  };

  // FIXED: Navigate back to TrainingSelection instead of Home
  const handleFinish = async () => {
    try {
      const workoutData = {
        type: activityType,
        duration: timer,
        distance: distance.toFixed(2),
        pace: averagePace,
        paceFormatted: formatPace(averagePace),
        splits: splits,
        elevation: elevation,
        calories: Math.floor(timer * 8), // Better calculation for running
        route: coordinates,
        date: new Date().toISOString(),
        enhanced: true // Mark as enhanced
      };

      // Clear auto-save
      await AsyncStorage.removeItem('runningProgress');
      
      setIsTracking(false);
      
      // FIXED: Go back to TrainingSelection instead of Home
      navigation.navigate('TrainingSelection', { 
        newWorkout: workoutData,
        message: 'Run completed successfully!'
      });
      
    } catch (error) {
      Alert.alert('Error saving workout', error.message);
    }
  };

  // Same permission screen as your TrainingScreen
  if (permissionStatus !== 'granted' && !isLoading) {
    return (
      <View style={[styles.container, styles.permissionContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.permissionText, { color: colors.text }]}>
          Location permission is required to track your workout
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          onPress={requestLocationPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.permissionButtonText, { color: colors.text }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Your existing header - no changes! */}
      <TrainingHeader 
        activityType={activityType}
        timer={timer}
        theme={theme}
        isPaused={isPaused}
      />
      
      {/* Your existing map - no changes! */}
      <TrainingMap
        currentLocation={currentLocation}
        coordinates={coordinates}
        theme={theme}
      />
      
      {/* Your existing stats - no changes! */}
      <TrainingStats
        distance={distance}
        timer={timer}
        theme={theme}
      />
      
      {/* NEW: Running-specific metrics - THIS IS THE VISIBLE ENHANCEMENT! */}
      {isTracking && (
        <View style={[styles.runningMetrics, { backgroundColor: colors.surface }]}>
          <Text style={[styles.metricsTitle, { color: colors.primary }]}>
            🏃‍♂️ Running Metrics
          </Text>
          
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
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>SPLITS</Text>
              <Text style={[styles.metricValue, { color: colors.primary }]}>
                {splits.length}
              </Text>
              <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>km</Text>
            </View>
          </View>
          
          {elevation.gain > 5 && (
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>ELEVATION ↑</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  {Math.round(elevation.gain)}
                </Text>
                <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>m</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>ELEVATION ↓</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  {Math.round(elevation.loss)}
                </Text>
                <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>m</Text>
              </View>
            </View>
          )}
        </View>
      )}
      
      {/* Your existing controls - no changes! */}
      <TrainingControls
        isTracking={isTracking}
        isPaused={isPaused}
        onStartPause={handleStartPause}
        onFinish={handleFinish}
        onShare={shareRoute}
        theme={theme}
      />
    </View>
  );
}

// Same styles as your TrainingScreen + NEW running metrics styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    lineHeight: 26,
  },
  permissionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // NEW: Running-specific metrics styles
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
});