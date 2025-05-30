// components/training/CyclingTracker.js
import { useState, useEffect } from 'react';
import { Vibration, Alert } from 'react-native';
import * as Location from 'expo-location';
import BaseTracker from './BaseTracker';

// CyclingTracker class that extends BaseTracker
class CyclingTracker extends BaseTracker {
  constructor(userId) {
    super('Cycling', userId);
    
    // Cycling-specific data
    this.distance = 0; // meters
    this.totalElevationGain = 0; // meters
    this.totalElevationLoss = 0; // meters
    this.currentSpeed = 0; // km/h
    this.maxSpeed = 0; // km/h
    this.avgSpeed = 0; // km/h
    this.currentCadence = 0; // RPM (if available)
    this.avgCadence = 0; // RPM
    
    // GPS and location tracking
    this.route = []; // Array of GPS coordinates
    this.lastLocation = null;
    this.currentLocation = null;
    this.currentElevation = 0;
    this.lastElevation = 0;
    
    // Intervals and segments
    this.intervals = []; // For interval training
    this.segments = []; // Road segments
    this.currentSegment = null;
    
    // Auto-pause functionality
    this.autoPauseEnabled = true;
    this.autoPauseSpeed = 2; // km/h threshold
    this.pausedTime = 0;
    
    // Location tracking
    this.locationSubscription = null;
    this.locationUpdateInterval = null;
    
    // Performance metrics
    this.speedHistory = [];
    this.cadenceHistory = [];
    this.heartRateHistory = [];
  }

  // Override start to initialize GPS tracking
  async start() {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for cycling tracking.');
        return false;
      }

      const started = await super.start();
      if (started) {
        await this.startLocationTracking();
        this.currentSegment = this.createNewSegment();
      }
      return started;
    } catch (error) {
      console.error('Failed to start cycling tracker:', error);
      return false;
    }
  }

  // Override stop to clean up GPS tracking
  stop() {
    const stopped = super.stop();
    if (stopped) {
      this.stopLocationTracking();
      if (this.currentSegment) {
        this.finishCurrentSegment();
      }
    }
    return stopped;
  }

  // Start GPS location tracking
  async startLocationTracking() {
    try {
      // Get initial location
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      
      this.currentLocation = initialLocation.coords;
      this.lastLocation = initialLocation.coords;
      this.currentElevation = initialLocation.coords.altitude || 0;
      this.lastElevation = this.currentElevation;
      
      this.route.push({
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
        altitude: initialLocation.coords.altitude || 0,
        timestamp: new Date().toISOString(),
        speed: 0,
        distance: 0,
      });

      // Start continuous location updates
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (location) => {
          this.handleLocationUpdate(location);
        }
      );

    } catch (error) {
      console.error('Failed to start location tracking:', error);
    }
  }

  // Stop GPS location tracking
  stopLocationTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  // Handle GPS location updates
  handleLocationUpdate(location) {
    if (!this.isActive || this.isPaused) return;

    const coords = location.coords;
    this.lastLocation = this.currentLocation;
    this.currentLocation = coords;
    this.lastElevation = this.currentElevation;
    this.currentElevation = coords.altitude || 0;

    // Calculate distance from last point
    if (this.lastLocation) {
      const segmentDistance = this.calculateDistance(
        this.lastLocation.latitude,
        this.lastLocation.longitude,
        coords.latitude,
        coords.longitude
      );

      // Only update if we've moved more than 2 meters (to filter GPS noise)
      if (segmentDistance > 2) {
        this.distance += segmentDistance;
        
        // Calculate current speed (km/h)
        const timeDiff = (Date.now() - this.lastLocationTime) / 1000; // seconds
        this.currentSpeed = timeDiff > 0 ? (segmentDistance / timeDiff) * 3.6 : 0;
        
        // Update max speed
        if (this.currentSpeed > this.maxSpeed) {
          this.maxSpeed = this.currentSpeed;
        }
        
        // Calculate elevation changes
        const elevationChange = this.currentElevation - this.lastElevation;
        if (elevationChange > 0) {
          this.totalElevationGain += elevationChange;
        } else {
          this.totalElevationLoss += Math.abs(elevationChange);
        }
        
        // Add to route
        this.route.push({
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude || 0,
          timestamp: new Date().toISOString(),
          speed: this.currentSpeed,
          distance: this.distance,
        });
        
        // Update speed history
        this.speedHistory.push({
          speed: this.currentSpeed,
          timestamp: new Date().toISOString(),
        });
        
        // Auto-pause functionality
        if (this.autoPauseEnabled && this.currentSpeed < this.autoPauseSpeed) {
          this.handleAutoPause();
        }
        
        // Update current segment
        if (this.currentSegment) {
          this.updateCurrentSegment(segmentDistance, elevationChange);
        }
      }
    }
    
    this.lastLocationTime = Date.now();
    this.calculateAverageSpeed();
  }

  // Calculate distance between two GPS points using Haversine formula
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

    return R * c; // Distance in meters
  }

  // Calculate average speed
  calculateAverageSpeed() {
    if (this.duration > 0) {
      this.avgSpeed = (this.distance / 1000) / (this.duration / 3600); // km/h
    }
  }

  // Handle auto-pause
  handleAutoPause() {
    if (!this.isPaused) {
      this.pause();
      this.onAutoPause();
    }
  }

  // Create new segment
  createNewSegment() {
    return {
      id: `segment_${Date.now()}`,
      startTime: new Date().toISOString(),
      startDistance: this.distance,
      startElevation: this.currentElevation,
      distance: 0,
      elevationGain: 0,
      elevationLoss: 0,
      avgSpeed: 0,
      maxSpeed: 0,
      route: [],
    };
  }

  // Update current segment
  updateCurrentSegment(segmentDistance, elevationChange) {
    this.currentSegment.distance += segmentDistance;
    
    if (elevationChange > 0) {
      this.currentSegment.elevationGain += elevationChange;
    } else {
      this.currentSegment.elevationLoss += Math.abs(elevationChange);
    }
    
    if (this.currentSpeed > this.currentSegment.maxSpeed) {
      this.currentSegment.maxSpeed = this.currentSpeed;
    }
    
    this.currentSegment.route.push({
      latitude: this.currentLocation.latitude,
      longitude: this.currentLocation.longitude,
      altitude: this.currentElevation,
      timestamp: new Date().toISOString(),
    });
  }

  // Finish current segment
  finishCurrentSegment() {
    if (this.currentSegment) {
      this.currentSegment.endTime = new Date().toISOString();
      this.currentSegment.avgSpeed = this.currentSegment.distance > 0 ? 
        (this.currentSegment.distance / 1000) / ((Date.now() - new Date(this.currentSegment.startTime)) / 3600000) : 0;
      
      this.segments.push(this.currentSegment);
      this.currentSegment = null;
    }
  }

  // Start interval training
  startInterval(type, duration, targetPower = null) {
    const interval = {
      id: `interval_${Date.now()}`,
      type: type, // 'work', 'rest', 'warmup', 'cooldown'
      startTime: new Date().toISOString(),
      duration: duration, // seconds
      targetPower: targetPower,
      startDistance: this.distance,
      startSpeed: this.currentSpeed,
      avgSpeed: 0,
      maxSpeed: 0,
    };
    
    this.intervals.push(interval);
    return interval;
  }

  // Get cycling statistics
  getCyclingStats() {
    const movingTime = this.duration - this.pausedTime;
    const avgMovingSpeed = movingTime > 0 ? (this.distance / 1000) / (movingTime / 3600) : 0;
    
    return {
      distance: this.distance / 1000, // km
      totalTime: this.duration, // seconds
      movingTime: movingTime, // seconds
      avgSpeed: this.avgSpeed,
      avgMovingSpeed: avgMovingSpeed,
      maxSpeed: this.maxSpeed,
      currentSpeed: this.currentSpeed,
      totalElevationGain: this.totalElevationGain,
      totalElevationLoss: this.totalElevationLoss,
      totalElevationChange: this.totalElevationGain + this.totalElevationLoss,
      avgCadence: this.avgCadence,
      currentCadence: this.currentCadence,
      segments: this.segments.length,
      intervals: this.intervals.length,
    };
  }

  // Override calorie calculation for cycling
  calculateCalories() {
    // More accurate cycling calorie calculation based on distance and speed
    const weightKg = 70; // Default weight, should come from user profile
    const MET = this.calculateCyclingMET();
    const hours = this.duration / 3600;
    return Math.round(MET * weightKg * hours);
  }

  calculateCyclingMET() {
    if (this.avgSpeed < 16) return 4.0; // Light effort
    if (this.avgSpeed < 19) return 6.8; // Moderate effort  
    if (this.avgSpeed < 22) return 8.0; // Vigorous effort
    if (this.avgSpeed < 25) return 10.0; // Very vigorous
    return 12.0; // Racing
  }

  // Override enhanceSessionData to include cycling data
  async enhanceSessionData(sessionData) {
    const baseData = await super.enhanceSessionData(sessionData);
    const stats = this.getCyclingStats();
    
    return {
      ...baseData,
      distance: this.distance,
      route: this.route,
      segments: this.segments,
      intervals: this.intervals,
      stats: stats,
      maxSpeed: this.maxSpeed,
      avgSpeed: this.avgSpeed,
      currentSpeed: this.currentSpeed,
      elevation: {
        gain: this.totalElevationGain,
        loss: this.totalElevationLoss,
        current: this.currentElevation,
      },
      autoPauseEnabled: this.autoPauseEnabled,
      cyclingSpecific: true,
    };
  }

  // Override prepareWorkoutData for final workout
  async prepareWorkoutData(sessionData) {
    const baseWorkout = await super.prepareWorkoutData(sessionData);
    const stats = this.getCyclingStats();
    
    return {
      ...baseWorkout,
      distance: this.distance / 1000, // km
      route: this.route,
      segments: this.segments,
      intervals: this.intervals,
      stats: stats,
      activitySubtype: 'Road Cycling',
      enhanced: true,
      gpsTracked: true,
    };
  }

  // Override cleanup to stop location tracking
  cleanup() {
    super.cleanup();
    this.stopLocationTracking();
  }

  // Cycling-specific callbacks
  onAutoPause() {
    console.log('Auto-paused due to low speed');
    Vibration.vibrate(200);
  }

  onLocationUpdate(location) {
    // Override in hook to update UI
  }

  onStatsUpdate(stats) {
    // Override in hook to update UI
  }

  // Utility methods
  formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  formatSpeed(kmh) {
    return `${kmh.toFixed(1)} km/h`;
  }

  formatElevation(meters) {
    return `${Math.round(meters)}m`;
  }
}

// React Hook for using CyclingTracker
const useCyclingTracker = (userId) => {
  const [tracker] = useState(() => new CyclingTracker(userId));
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [elevation, setElevation] = useState({ gain: 0, loss: 0, current: 0 });
  const [route, setRoute] = useState([]);
  const [segments, setSegments] = useState([]);
  const [intervals, setIntervals] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Override callbacks for cycling-specific updates
    tracker.onDurationUpdate = (newDuration) => {
      setDuration(newDuration);
    };

    tracker.onLocationUpdate = (location) => {
      setCurrentLocation(location);
    };

    tracker.onStatsUpdate = (stats) => {
      setDistance(stats.distance * 1000);
      setCurrentSpeed(stats.currentSpeed);
      setAvgSpeed(stats.avgSpeed);
      setMaxSpeed(stats.maxSpeed);
      setElevation({
        gain: stats.totalElevationGain,
        loss: stats.totalElevationLoss,
        current: tracker.currentElevation,
      });
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
      const stats = tracker.getCyclingStats();
      setDistance(tracker.distance);
      setCurrentSpeed(tracker.currentSpeed);
      setAvgSpeed(tracker.avgSpeed);
      setMaxSpeed(tracker.maxSpeed);
      setElevation({
        gain: tracker.totalElevationGain,
        loss: tracker.totalElevationLoss,
        current: tracker.currentElevation,
      });
      setRoute([...tracker.route]);
      setSegments([...tracker.segments]);
      setIntervals([...tracker.intervals]);
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [tracker]);

  const startInterval = (type, duration, targetPower) => {
    return tracker.startInterval(type, duration, targetPower);
  };

  const finishSegment = () => {
    tracker.finishCurrentSegment();
    setSegments([...tracker.segments]);
  };

  return {
    tracker,
    duration,
    distance,
    currentSpeed,
    avgSpeed,
    maxSpeed,
    elevation,
    route,
    segments,
    intervals,
    currentLocation,
    isActive,
    isPaused,
    formattedDuration: tracker.formatDuration(duration),
    startInterval,
    finishSegment,
    getCyclingStats: () => tracker.getCyclingStats(),
    formatDistance: (meters) => tracker.formatDistance(meters),
    formatSpeed: (kmh) => tracker.formatSpeed(kmh),
    formatElevation: (meters) => tracker.formatElevation(meters),
    // BaseTracker methods
    startTracking: async () => await tracker.start(),
    pauseTracking: () => tracker.pause(),
    resumeTracking: () => tracker.resume(),
    stopTracking: () => tracker.stop(),
    saveWorkout: async () => await tracker.saveWorkout(),
  };
};

export { useCyclingTracker };
export default CyclingTracker;