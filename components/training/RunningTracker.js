// components/training/RunningTracker.js
import BaseTracker from './BaseTracker';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

class RunningTracker extends BaseTracker {
  constructor(userId) {
    super('Running', userId);
    
    // Running-specific properties
    this.gpsPoints = [];
    this.distance = 0; // in meters
    this.currentPace = 0; // min/km
    this.averagePace = 0; // min/km
    this.splits = []; // km splits
    this.elevation = { gain: 0, loss: 0, current: 0 };
    this.currentSpeed = 0; // m/s
    this.maxSpeed = 0;
    
    // GPS tracking
    this.watchId = null;
    this.lastGpsPoint = null;
    this.gpsAccuracy = 10; // minimum accuracy in meters
    
    // Auto-lap settings
    this.lapDistance = 1000; // 1km
    this.lastLapDistance = 0;
  }

  async requestLocationPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to location for GPS tracking.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handles permissions differently
  }

  async onStart() {
    super.onStart();
    
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    this.startGPSTracking();
  }

  startGPSTracking() {
    const options = {
      enableHighAccuracy: true,
      distanceFilter: 5, // minimum distance (in meters) to trigger update
      interval: 5000, // update interval in ms
      fastestInterval: 2000, // fastest update interval
    };

    this.watchId = Geolocation.watchPosition(
      (position) => {
        this.handleGPSUpdate(position);
      },
      (error) => {
        console.error('GPS Error:', error);
      },
      options
    );
  }

  handleGPSUpdate(position) {
    const { latitude, longitude, accuracy, altitude, speed } = position.coords;
    
    // Filter out inaccurate GPS points
    if (accuracy > this.gpsAccuracy) {
      return;
    }

    const timestamp = new Date().toISOString();
    const newPoint = {
      latitude,
      longitude,
      altitude: altitude || 0,
      accuracy,
      speed: speed || 0,
      timestamp,
    };

    // Calculate distance and pace if we have a previous point
    if (this.lastGpsPoint) {
      const segmentDistance = this.calculateDistance(this.lastGpsPoint, newPoint);
      const timeDiff = (new Date(timestamp) - new Date(this.lastGpsPoint.timestamp)) / 1000; // seconds
      
      // Update distance
      this.distance += segmentDistance;
      
      // Calculate current speed and pace
      if (timeDiff > 0) {
        this.currentSpeed = segmentDistance / timeDiff; // m/s
        this.maxSpeed = Math.max(this.maxSpeed, this.currentSpeed);
        this.currentPace = this.calculatePace(this.currentSpeed);
      }
      
      // Update elevation
      if (this.lastGpsPoint.altitude && newPoint.altitude) {
        const elevationChange = newPoint.altitude - this.lastGpsPoint.altitude;
        if (elevationChange > 0) {
          this.elevation.gain += elevationChange;
        } else {
          this.elevation.loss += Math.abs(elevationChange);
        }
      }
      
      // Check for auto-lap
      this.checkAutoLap();
    }

    this.gpsPoints.push(newPoint);
    this.lastGpsPoint = newPoint;
    this.elevation.current = newPoint.altitude || 0;

    // Calculate average pace
    if (this.duration > 0 && this.distance > 0) {
      const averageSpeed = this.distance / this.duration; // m/s
      this.averagePace = this.calculatePace(averageSpeed);
    }

    // Trigger real-time updates
    this.onRunningDataUpdate();
  }

  calculateDistance(point1, point2) {
    // Haversine formula for calculating distance between two GPS points
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
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

  checkAutoLap() {
    const distanceSinceLastLap = this.distance - this.lastLapDistance;
    
    if (distanceSinceLastLap >= this.lapDistance) {
      this.recordSplit();
    }
  }

  recordSplit() {
    const splitNumber = this.splits.length + 1;
    const splitDistance = this.distance - this.lastLapDistance;
    const splitTime = this.duration - (this.splits.length > 0 ? 
      this.splits.reduce((total, split) => total + split.time, 0) : 0);
    
    const splitPace = splitTime > 0 ? this.calculatePace(splitDistance / splitTime) : 0;
    
    const split = {
      number: splitNumber,
      distance: splitDistance,
      time: splitTime,
      pace: splitPace,
      timestamp: new Date().toISOString(),
    };

    this.splits.push(split);
    this.lastLapDistance = this.distance;
    
    // Trigger split notification
    this.onSplitRecorded(split);
  }

  onStop() {
    super.onStop();
    
    // Stop GPS tracking
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    // Record final split if needed
    if (this.distance - this.lastLapDistance > 100) { // At least 100m
      this.recordSplit();
    }
  }

  getRunningStats() {
    return {
      distance: this.distance,
      distanceKm: this.distance / 1000,
      currentPace: this.currentPace,
      averagePace: this.averagePace,
      currentSpeed: this.currentSpeed,
      maxSpeed: this.maxSpeed,
      elevation: this.elevation,
      splits: this.splits,
      gpsPoints: this.gpsPoints,
    };
  }

  async enhanceSessionData(sessionData) {
    const baseData = await super.enhanceSessionData(sessionData);
    const runningStats = this.getRunningStats();
    
    return {
      ...baseData,
      ...runningStats,
      avgSpeedKmh: (runningStats.distance / 1000) / (this.duration / 3600),
      totalGpsPoints: this.gpsPoints.length,
    };
  }

  async prepareWorkoutData(sessionData) {
    const baseWorkout = await super.prepareWorkoutData(sessionData);
    const runningStats = this.getRunningStats();
    
    return {
      ...baseWorkout,
      activityData: {
        type: 'Running',
        distance: runningStats.distance,
        distanceKm: runningStats.distanceKm,
        averagePace: runningStats.averagePace,
        maxSpeed: runningStats.maxSpeed,
        elevation: runningStats.elevation,
        splits: runningStats.splits,
        route: this.compressGPSPoints(runningStats.gpsPoints),
      },
      summary: {
        distance: `${runningStats.distanceKm.toFixed(2)} km`,
        pace: this.formatPace(runningStats.averagePace),
        splits: runningStats.splits.length,
      },
    };
  }

  compressGPSPoints(points) {
    // Simple compression: keep every nth point and important points
    if (points.length <= 100) return points;
    
    const compressed = [];
    const step = Math.ceil(points.length / 100);
    
    for (let i = 0; i < points.length; i += step) {
      compressed.push(points[i]);
    }
    
    // Always include start and end
    if (compressed[compressed.length - 1] !== points[points.length - 1]) {
      compressed.push(points[points.length - 1]);
    }
    
    return compressed;
  }

  // Override callbacks for UI updates
  onRunningDataUpdate() {
    // Override in component for real-time UI updates
  }

  onSplitRecorded(split) {
    console.log(`Split ${split.number}: ${this.formatPace(split.pace)} pace`);
    // Override in component for split notifications
  }
}

// React Hook for RunningTracker
export const useRunningTracker = (userId) => {
  const [tracker] = useState(() => new RunningTracker(userId));
  const [runningData, setRunningData] = useState({
    distance: 0,
    currentPace: 0,
    averagePace: 0,
    splits: [],
    elevation: { gain: 0, loss: 0, current: 0 },
  });

  useEffect(() => {
    // Override data update callback
    tracker.onRunningDataUpdate = () => {
      setRunningData(tracker.getRunningStats());
    };

    return () => {
      tracker.cleanup();
    };
  }, [tracker]);

  return {
    ...runningData,
    tracker,
    formatPace: tracker.formatPace.bind(tracker),
    recordManualSplit: () => tracker.recordSplit(),
  };
};

export default RunningTracker;