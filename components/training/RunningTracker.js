// components/training/RunningTracker.js
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple RunningTracker class for the hook
class RunningTracker {
  constructor(userId) {
    this.userId = userId;
    this.activityType = 'Running';
    
    // Tracking state
    this.isActive = false;
    this.isPaused = false;
    this.duration = 0;
    this.startTime = null;
    
    // GPS data
    this.gpsPoints = [];
    this.distance = 0; // in meters
    this.currentPace = 0; // min/km
    this.averagePace = 0; // min/km
    this.splits = [];
    this.elevation = { gain: 0, loss: 0, current: 0 };
    
    // Internal tracking
    this.watchId = null;
    this.lastGpsPoint = null;
    this.timerInterval = null;
  }

  async start() {
    if (this.isActive) return false;

    // Request location permission
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    this.startTime = new Date();
    this.isActive = true;
    this.isPaused = false;
    
    // Start GPS tracking
    this.startGPSTracking();
    
    return true;
  }

  pause() {
    if (!this.isActive || this.isPaused) return false;
    this.isPaused = true;
    return true;
  }

  resume() {
    if (!this.isActive || !this.isPaused) return false;
    this.isPaused = false;
    return true;
  }

  stop() {
    if (!this.isActive) return false;
    
    this.isActive = false;
    this.isPaused = false;
    
    // Stop GPS tracking
    if (this.watchId !== null) {
      Location.watchPositionAsync(this.watchId).then(subscription => {
        if (subscription) subscription.remove();
      });
      this.watchId = null;
    }
    
    return true;
  }

  async requestLocationPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
      }
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

  async startGPSTracking() {
    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location) => {
          if (!this.isPaused && this.isActive) {
            this.handleGPSUpdate(location);
          }
        }
      );
      this.watchId = subscription;
    } catch (error) {
      console.error('GPS tracking error:', error);
    }
  }

  handleGPSUpdate(position) {
    const { latitude, longitude, altitude } = position.coords;
    
    const newPoint = {
      latitude,
      longitude,
      altitude: altitude || 0,
      timestamp: new Date().toISOString(),
    };

    // Calculate distance if we have a previous point
    if (this.lastGpsPoint) {
      const segmentDistance = this.calculateDistance(this.lastGpsPoint, newPoint);
      this.distance += segmentDistance;
      
      // Calculate pace
      if (this.duration > 0 && this.distance > 0) {
        const averageSpeed = this.distance / this.duration; // m/s
        this.averagePace = this.calculatePace(averageSpeed);
      }
    }

    this.gpsPoints.push(newPoint);
    this.lastGpsPoint = newPoint;
  }

  calculateDistance(point1, point2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  calculatePace(speedMs) {
    if (speedMs === 0) return 0;
    const speedKmh = speedMs * 3.6;
    const paceMinPerKm = 60 / speedKmh;
    return paceMinPerKm;
  }

  formatPace(paceMinPerKm) {
    if (paceMinPerKm === 0) return '0:00';
    const minutes = Math.floor(paceMinPerKm);
    const seconds = Math.round((paceMinPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  async saveWorkout() {
    try {
      const workoutData = {
        id: `workout_${Date.now()}`,
        type: this.activityType,
        duration: this.duration,
        distance: this.distance,
        distanceKm: this.distance / 1000,
        averagePace: this.averagePace,
        gpsPoints: this.gpsPoints,
        splits: this.splits,
        elevation: this.elevation,
        date: new Date().toISOString(),
        userId: this.userId,
      };

      // Save to local storage
      const existingWorkouts = JSON.parse(
        await AsyncStorage.getItem('workoutHistory') || '[]'
      );
      existingWorkouts.unshift(workoutData);
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(existingWorkouts));

      return workoutData;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  }
}

// React Hook for using RunningTracker
export const useRunningTracker = (userId) => {
  const [tracker] = useState(() => new RunningTracker(userId));
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentPace, setCurrentPace] = useState(0);
  const [averagePace, setAveragePace] = useState(0);
  const [splits, setSplits] = useState([]);
  const [elevation, setElevation] = useState({ gain: 0, loss: 0, current: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (tracker.isActive && !tracker.isPaused) {
      timerRef.current = setInterval(() => {
        if (tracker.startTime) {
          const newDuration = Math.floor((new Date() - tracker.startTime) / 1000);
          tracker.duration = newDuration;
          setDuration(newDuration);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [tracker.isActive, tracker.isPaused]);

  // Update state when tracker changes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setDistance(tracker.distance);
      setCurrentPace(tracker.currentPace);
      setAveragePace(tracker.averagePace);
      setSplits([...tracker.splits]);
      setElevation({ ...tracker.elevation });
      setIsActive(tracker.isActive);
      setIsPaused(tracker.isPaused);
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [tracker]);

  const formatPace = (pace) => tracker.formatPace(pace);
  const recordManualSplit = () => {
    // Simple manual split implementation
    const split = {
      number: splits.length + 1,
      distance: distance,
      time: duration,
      timestamp: new Date().toISOString(),
    };
    tracker.splits.push(split);
    setSplits([...tracker.splits]);
  };

  return {
    tracker,
    duration,
    distance,
    currentPace,
    averagePace,
    splits,
    elevation,
    formatPace,
    recordManualSplit,
  };
};

export default RunningTracker;