import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { PermissionsAndroid, Platform, Alert, Vibration } from 'react-native';
import BaseTracker from './BaseTracker';

class RunningTracker extends BaseTracker {
  constructor(userId) {
    super('Running', userId);
    
    // Running-specific data
    this.distance = 0; // meters
    this.currentPace = 0; // min/km
    this.averagePace = 0; // min/km
    this.currentSpeed = 0; // km/h
    this.maxSpeed = 0; // km/h
    this.averageSpeed = 0; // km/h
    
    // GPS and elevation data
    this.gpsPoints = [];
    this.elevation = { 
      gain: 0, 
      loss: 0, 
      current: 0,
      max: 0,
      min: 0 
    };
    this.lastGpsPoint = null;
    this.lastElevation = 0;
    
    // Splits and lap data
    this.splits = [];
    this.autoLapDistance = 1000; // 1km auto-laps
    this.lastLapDistance = 0;
    
    // GPS tracking
    this.locationSubscription = null;
    this.gpsAccuracy = Location.Accuracy.BestForNavigation;
    
    // Performance tracking
    this.speedHistory = [];
    this.paceHistory = [];
    
    // Auto-pause functionality
    this.autoPauseEnabled = true;
    this.autoPauseSpeed = 1; // km/h threshold
    this.pausedDueToSpeed = false;
  }

  // Override start to initialize GPS tracking
  async start() {
    try {
      // Request location permissions
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Location permission is required for running tracking.');
        return false;
      }

      const started = await super.start();
      if (started) {
        await this.startGPSTracking();
        // Get initial location for elevation baseline
        await this.setInitialLocation();
      }
      return started;
    } catch (error) {
      console.error('Failed to start running tracker:', error);
      return false;
    }
  }

  // Override stop to clean up GPS tracking
  stop() {
    const stopped = super.stop();
    if (stopped) {
      this.stopGPSTracking();
    }
    return stopped;
  }

  // Request location permissions
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

  // Set initial location and elevation
  async setInitialLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: this.gpsAccuracy,
      });
      
      const coords = location.coords;
      this.lastElevation = coords.altitude || 0;
      this.elevation.current = this.lastElevation;
      this.elevation.max = this.lastElevation;
      this.elevation.min = this.lastElevation;
      
      const initialPoint = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude || 0,
        timestamp: new Date().toISOString(),
        accuracy: coords.accuracy,
        speed: 0,
        distance: 0,
      };
      
      this.gpsPoints.push(initialPoint);
      this.lastGpsPoint = initialPoint;
      
    } catch (error) {
      console.error('Failed to get initial location:', error);
    }
  }

  // Start GPS tracking
  async startGPSTracking() {
    try {
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: this.gpsAccuracy,
          timeInterval: 1000, // Update every second
          distanceInterval: 3, // Update every 3 meters
        },
        (location) => {
          if (this.isActive && !this.isPaused) {
            this.handleGPSUpdate(location);
          }
        }
      );
    } catch (error) {
      console.error('GPS tracking error:', error);
    }
  }

  // Stop GPS tracking
  stopGPSTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  // Handle GPS updates
  handleGPSUpdate(position) {
    const coords = position.coords;
    
    // Calculate distance from last point
    if (this.lastGpsPoint) {
      const segmentDistance = this.calculateDistance(
        this.lastGpsPoint.latitude,
        this.lastGpsPoint.longitude,
        coords.latitude,
        coords.longitude
      );

      // Filter out GPS noise (movements less than 2 meters)
      if (segmentDistance > 2) {
        this.distance += segmentDistance;
        
        // Calculate current speed and pace
        const timeDiff = (Date.now() - new Date(this.lastGpsPoint.timestamp)) / 1000; // seconds
        if (timeDiff > 0) {
          this.currentSpeed = (segmentDistance / timeDiff) * 3.6; // km/h
          this.currentPace = this.calculatePace(this.currentSpeed);
          
          // Update max speed
          if (this.currentSpeed > this.maxSpeed) {
            this.maxSpeed = this.currentSpeed;
          }
          
          // Track speed history
          this.speedHistory.push({
            speed: this.currentSpeed,
            timestamp: new Date().toISOString(),
          });
          
          // Auto-pause check
          if (this.autoPauseEnabled && this.currentSpeed < this.autoPauseSpeed) {
            this.handleAutoPause();
          } else if (this.pausedDueToSpeed && this.currentSpeed >= this.autoPauseSpeed) {
            this.handleAutoResume();
          }
        }
        
        // Calculate elevation changes
        const currentElevation = coords.altitude || 0;
        const elevationChange = currentElevation - this.lastElevation;
        
        if (elevationChange > 0) {
          this.elevation.gain += elevationChange;
        } else {
          this.elevation.loss += Math.abs(elevationChange);
        }
        
        this.elevation.current = currentElevation;
        if (currentElevation > this.elevation.max) {
          this.elevation.max = currentElevation;
        }
        if (currentElevation < this.elevation.min) {
          this.elevation.min = currentElevation;
        }
        
        this.lastElevation = currentElevation;
        
        // Check for auto-lap
        this.checkAutoLap();
      }
    }
    
    // Add GPS point
    const gpsPoint = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      altitude: coords.altitude || 0,
      timestamp: new Date().toISOString(),
      accuracy: coords.accuracy,
      speed: this.currentSpeed,
      distance: this.distance,
    };
    
    this.gpsPoints.push(gpsPoint);
    this.lastGpsPoint = gpsPoint;
    
    // Calculate running averages
    this.calculateAverages();
    
    // Trigger callback for UI updates
    this.onGPSUpdate(gpsPoint);
  }

  // Calculate distance using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Calculate pace from speed
  calculatePace(speedKmh) {
    if (speedKmh === 0) return 0;
    return 60 / speedKmh; // minutes per km
  }

  // Calculate running averages
  calculateAverages() {
    if (this.duration > 0 && this.distance > 0) {
      const distanceKm = this.distance / 1000;
      const durationHours = this.duration / 3600;
      this.averageSpeed = distanceKm / durationHours;
      this.averagePace = this.calculatePace(this.averageSpeed);
    }
  }

  // Check for auto-lap
  checkAutoLap() {
    const distanceSinceLastLap = this.distance - this.lastLapDistance;
    
    if (distanceSinceLastLap >= this.autoLapDistance) {
      this.recordAutoLap();
    }
  }

  // Record automatic lap
  recordAutoLap() {
    const lapNumber = this.splits.length + 1;
    const lapDistance = this.distance - this.lastLapDistance;
    const lapTime = this.duration - (this.splits.length > 0 ? 
      this.splits.reduce((sum, split) => sum + split.time, 0) : 0);
    
    const split = {
      number: lapNumber,
      distance: lapDistance,
      totalDistance: this.distance,
      time: lapTime,
      pace: lapTime > 0 ? (lapTime / 60) / (lapDistance / 1000) : 0,
      timestamp: new Date().toISOString(),
      type: 'auto',
    };
    
    this.splits.push(split);
    this.lastLapDistance = this.distance;
    
    // Trigger vibration feedback
    Vibration.vibrate(200);
    
    return split;
  }

  // Record manual split
  recordManualSplit() {
    const lapNumber = this.splits.length + 1;
    const lapDistance = this.distance - this.lastLapDistance;
    const lapTime = this.duration - (this.splits.length > 0 ? 
      this.splits.reduce((sum, split) => sum + split.time, 0) : 0);
    
    const split = {
      number: lapNumber,
      distance: lapDistance,
      totalDistance: this.distance,
      time: lapTime,
      pace: lapTime > 0 ? (lapTime / 60) / (lapDistance / 1000) : 0,
      timestamp: new Date().toISOString(),
      type: 'manual',
    };
    
    this.splits.push(split);
    this.lastLapDistance = this.distance;
    
    // Trigger vibration feedback
    Vibration.vibrate([100, 100, 100]);
    
    return split;
  }

  // Handle auto-pause
  handleAutoPause() {
    if (!this.isPaused) {
      this.pause();
      this.pausedDueToSpeed = true;
      this.onAutoPause();
    }
  }

  // Handle auto-resume
  handleAutoResume() {
    if (this.isPaused && this.pausedDueToSpeed) {
      this.resume();
      this.pausedDueToSpeed = false;
      this.onAutoResume();
    }
  }

  // Get running statistics
  getRunningStats() {
    const distanceKm = this.distance / 1000;
    const durationHours = this.duration / 3600;
    
    return {
      distance: this.distance, // meters
      distanceKm: distanceKm,
      duration: this.duration, // seconds
      averageSpeed: this.averageSpeed, // km/h
      maxSpeed: this.maxSpeed, // km/h
      currentSpeed: this.currentSpeed, // km/h
      averagePace: this.averagePace, // min/km
      currentPace: this.currentPace, // min/km
      elevation: this.elevation,
      splits: this.splits.length,
      totalElevationChange: this.elevation.gain + this.elevation.loss,
      caloriesEstimate: this.calculateRunningCalories(),
    };
  }

  // Override calorie calculation for running
  calculateCalories() {
    return this.calculateRunningCalories();
  }

  calculateRunningCalories() {
    // More accurate running calorie calculation
    const weightKg = 70; // Default weight, should come from user profile
    const MET = this.calculateRunningMET();
    const hours = this.duration / 3600;
    return Math.round(MET * weightKg * hours);
  }

  calculateRunningMET() {
    if (this.averageSpeed < 6) return 6.0; // Slow jog
    if (this.averageSpeed < 8) return 8.3; // Running 8 km/h
    if (this.averageSpeed < 10) return 9.8; // Running 9.7 km/h
    if (this.averageSpeed < 12) return 11.0; // Running 11.3 km/h
    if (this.averageSpeed < 14) return 11.8; // Running 12.9 km/h
    if (this.averageSpeed < 16) return 12.8; // Running 14.5 km/h
    return 14.5; // Running 16+ km/h
  }

  // Override enhanceSessionData to include running data
  async enhanceSessionData(sessionData) {
    const baseData = await super.enhanceSessionData(sessionData);
    const stats = this.getRunningStats();
    
    return {
      ...baseData,
      distance: this.distance,
      distanceKm: this.distance / 1000,
      gpsPoints: this.gpsPoints,
      splits: this.splits,
      elevation: this.elevation,
      stats: stats,
      averageSpeed: this.averageSpeed,
      maxSpeed: this.maxSpeed,
      averagePace: this.averagePace,
      runningSpecific: true,
    };
  }

  // Override prepareWorkoutData for final workout
  async prepareWorkoutData(sessionData) {
    const baseWorkout = await super.prepareWorkoutData(sessionData);
    const stats = this.getRunningStats();
    
    return {
      ...baseWorkout,
      name: `Running Session ${new Date().toISOString().split('T')[0]}`,
      duration: this.duration,
      calories: this.calculateCalories(),
      startTime: new Date(Date.now() - this.duration * 1000).toISOString(),
      endTime: new Date().toISOString(),
      distance: this.distance,
      distanceKm: this.distance / 1000,
      averagePace: this.averagePace,
      currentPace: this.currentPace,
      averageSpeed: this.averageSpeed,
      maxSpeed: this.maxSpeed,
      route: {
        gpsPoints: this.gpsPoints,
        polyline: this.compressRoute(),
      },
      splits: this.splits,
      elevation: this.elevation,
      stats: stats,
      activitySubtype: 'Outdoor Running',
      enhanced: true,
      gpsTracked: true,
    };
  }

  // Compress GPS route for storage
  compressRoute() {
    // Simple compression - take every Nth point
    const compressionRatio = Math.max(1, Math.floor(this.gpsPoints.length / 500));
    return this.gpsPoints
      .filter((_, index) => index % compressionRatio === 0)
      .map(point => `${point.latitude},${point.longitude}`)
      .join('|');
  }

  // Override cleanup to stop GPS tracking
  cleanup() {
    super.cleanup();
    this.stopGPSTracking();
  }

  // Running-specific callbacks
  onAutoPause() {
    console.log('Auto-paused due to low speed');
    Vibration.vibrate(300);
  }

  onAutoResume() {
    console.log('Auto-resumed - speed increased');
    Vibration.vibrate(100);
  }

  onGPSUpdate(gpsPoint) {
    // Override in hook to update UI
  }

  onStatsUpdate(stats) {
    // Override in hook to update UI
  }

  // Utility formatting methods
  formatPace(paceMinPerKm) {
    if (!paceMinPerKm || paceMinPerKm === 0) return '0:00';
    const minutes = Math.floor(paceMinPerKm);
    const seconds = Math.round((paceMinPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatSpeed(speedKmh) {
    return `${speedKmh.toFixed(1)} km/h`;
  }

  formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  }
}

// React Hook for using RunningTracker
const useRunningTracker = (userId) => {
  const [tracker] = useState(() => new RunningTracker(userId));
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentPace, setCurrentPace] = useState(0);
  const [averagePace, setAveragePace] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [splits, setSplits] = useState([]);
  const [elevation, setElevation] = useState({ gain: 0, loss: 0, current: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gpsPoints, setGpsPoints] = useState([]);

  useEffect(() => {
    // Override callbacks for running-specific updates
    tracker.onDurationUpdate = (newDuration) => {
      setDuration(newDuration);
    };

    tracker.onGPSUpdate = (gpsPoint) => {
      setGpsPoints([...tracker.gpsPoints]);
    };

    tracker.onStatsUpdate = (stats) => {
      setDistance(stats.distance);
      setCurrentSpeed(stats.currentSpeed);
      setAverageSpeed(stats.averageSpeed);
      setMaxSpeed(stats.maxSpeed);
      setCurrentPace(stats.currentPace);
      setAveragePace(stats.averagePace);
      setElevation(stats.elevation);
    };

    // Override state change callbacks
    const originalStart = tracker.onStart;
    tracker.onStart = () => {
      setIsActive(true);
      setIsPaused(false);
      originalStart.call(tracker);
    };

    const originalPause = tracker.onPause;
    tracker.onPause = () => {
      setIsPaused(true);
      originalPause.call(tracker);
    };

    const originalResume = tracker.onResume;
    tracker.onResume = () => {
      setIsPaused(false);
      originalResume.call(tracker);
    };

    const originalStop = tracker.onStop;
    tracker.onStop = () => {
      setIsActive(false);
      setIsPaused(false);
      originalStop.call(tracker);
    };

    return () => {
      tracker.cleanup();
    };
  }, [tracker]);

  // Update state when tracker changes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const stats = tracker.getRunningStats();
      setDistance(tracker.distance);
      setCurrentSpeed(tracker.currentSpeed);
      setAverageSpeed(tracker.averageSpeed);
      setMaxSpeed(tracker.maxSpeed);
      setCurrentPace(tracker.currentPace);
      setAveragePace(tracker.averagePace);
      setElevation({ ...tracker.elevation });
      setSplits([...tracker.splits]);
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [tracker]);

  const recordManualSplit = () => {
    const split = tracker.recordManualSplit();
    setSplits([...tracker.splits]);
    return split;
  };

  return {
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
    formattedDuration: tracker.formatDuration(duration),
    recordManualSplit,
    getRunningStats: () => tracker.getRunningStats(),
    formatPace: (pace) => tracker.formatPace(pace),
    formatSpeed: (speed) => tracker.formatSpeed(speed),
    formatDistance: (meters) => tracker.formatDistance(meters),
    startTracking: async () => await tracker.start(),
    pauseTracking: () => tracker.pause(),
    resumeTracking: () => tracker.resume(),
    stopTracking: () => tracker.stop(),
    saveWorkout: async () => await tracker.saveWorkout(),
  };
};

export { useRunningTracker };
export default RunningTracker;