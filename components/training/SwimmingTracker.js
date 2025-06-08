import { useState, useEffect, useRef, useCallback } from 'react';
import { Vibration } from 'react-native';
import BaseTracker from './BaseTracker';
import { workoutAPI } from '../../services/workoutAPI';

// SwimmingTracker class that extends BaseTracker
class SwimmingTracker extends BaseTracker {
  constructor(userId) {
    super('Swimming', userId);
    
    // Swimming-specific data
    this.poolLength = 25; // meters
    this.strokeType = 'Freestyle';
    this.laps = [];
    this.totalDistance = 0;
    this.currentLapStartTime = null;
    
    // Rest tracking
    this.isResting = false;
    this.restTimeRemaining = 0;
    this.restInterval = null;
  }

  // Override start to initialize lap tracking
  async start() {
    const started = await super.start();
    if (started) {
      this.currentLapStartTime = 0;
    }
    return started;
  }

  // Override stop to clear rest timer
  stop() {
    const stopped = super.stop();
    if (stopped) {
      this.isResting = false;
      this.restTimeRemaining = 0;
      if (this.restInterval) {
        clearInterval(this.restInterval);
        this.restInterval = null;
      }
    }
    return stopped;
  }

  // Swimming-specific methods
  setPoolLength(length) {
    this.poolLength = length;
  }

  setStrokeType(stroke) {
    this.strokeType = stroke;
  }

  completeLap(strokeCount = 0) {
    if (!this.isActive || this.isResting) return null;

    const lapTime = this.duration - (this.currentLapStartTime || 0);
    const swolfScore = lapTime + strokeCount;
    
    const newLap = {
      lapNumber: this.laps.length + 1,
      time: lapTime,
      strokeType: this.strokeType,
      strokeCount: strokeCount,
      poolLength: this.poolLength,
      distance: this.poolLength,
      swolf: swolfScore,
      timestamp: new Date().toISOString(),
    };
    
    this.laps.push(newLap);
    this.totalDistance += this.poolLength;
    this.currentLapStartTime = this.duration;
    
    return newLap;
  }

  startRest(seconds = 30) {
    if (!this.isActive) return;

    this.isResting = true;
    this.restTimeRemaining = seconds;
    
    this.restInterval = setInterval(() => {
      this.restTimeRemaining--;
      this.onRestUpdate(this.restTimeRemaining);
      
      if (this.restTimeRemaining <= 0) {
        this.skipRest();
        Vibration.vibrate(500);
      }
    }, 1000);
  }

  skipRest() {
    this.isResting = false;
    this.restTimeRemaining = 0;
    if (this.restInterval) {
      clearInterval(this.restInterval);
      this.restInterval = null;
    }
  }

  // Calculate swimming statistics
  getSwimmingStats() {
    if (this.laps.length === 0) {
      return {
        avgLapTime: 0,
        avgSwolf: 0,
        avgStrokeRate: 0,
        pace100m: 0,
        totalLaps: 0,
        totalDistance: 0,
        caloriesEstimate: 0,
      };
    }

    const avgLapTime = this.laps.reduce((sum, lap) => sum + lap.time, 0) / this.laps.length;
    const avgSwolf = this.laps.reduce((sum, lap) => sum + lap.swolf, 0) / this.laps.length;
    const avgStrokeRate = this.laps.reduce((sum, lap) => {
      return sum + (lap.strokeCount > 0 ? lap.strokeCount / (lap.time / 60) : 0);
    }, 0) / this.laps.length;
    const pace100m = avgLapTime * (100 / this.poolLength);

    return {
      avgLapTime,
      avgSwolf,
      avgStrokeRate,
      pace100m,
      totalLaps: this.laps.length,
      totalDistance: this.totalDistance,
      caloriesEstimate: this.calculateCalories(),
    };
  }

  // Override calorie calculation for swimming
  calculateCalories() {
    // More accurate swimming calorie calculation
    const baseRate = 10; // calories per minute for swimming
    const intensityMultiplier = this.getIntensityMultiplier();
    return Math.round((this.duration / 60) * baseRate * intensityMultiplier);
  }

  getIntensityMultiplier() {
    if (this.laps.length === 0) return 1.0;
    
    const avgSwolf = this.getSwimmingStats().avgSwolf;
    // Lower SWOLF = higher intensity
    if (avgSwolf < 30) return 1.3; // High intensity
    if (avgSwolf < 40) return 1.1; // Medium intensity
    return 1.0; // Normal intensity
  }

  // Override enhanceSessionData to include swimming data
  async enhanceSessionData(sessionData) {
    const baseData = await super.enhanceSessionData(sessionData);
    const stats = this.getSwimmingStats();
    
    return {
      ...baseData,
      poolLength: this.poolLength,
      strokeType: this.strokeType,
      laps: this.laps,
      totalDistance: this.totalDistance,
      totalLaps: this.laps.length,
      stats: stats,
      isResting: this.isResting,
      restTimeRemaining: this.restTimeRemaining,
      swimmingSpecific: true,
    };
  }

  // Override prepareWorkoutData for final workout
  async prepareWorkoutData(sessionData) {
    const baseWorkout = await super.prepareWorkoutData(sessionData);
    const stats = this.getSwimmingStats();
    
    return {
      ...baseWorkout,
      name: `Swimming Session ${new Date().toISOString().split('T')[0]}`,
      duration: this.duration,
      calories: this.calculateCalories(),
      startTime: new Date(Date.now() - this.duration * 1000).toISOString(),
      endTime: new Date().toISOString(),
      poolLength: this.poolLength,
      strokeType: this.strokeType,
      laps: this.laps,
      totalDistance: this.totalDistance,
      totalLaps: this.laps.length,
      avgSwolf: stats.avgSwolf,
      avgStrokeRate: stats.avgStrokeRate,
      pace100m: stats.pace100m,
      enhanced: true,
      activitySubtype: 'Pool Swimming',
    };
  }

  // Override saveWorkout to use workoutAPI.saveWorkout
  async saveWorkout() {
    try {
      const sessionData = await this.enhanceSessionData({});
      const trackerData = await this.prepareWorkoutData(sessionData);
      const response = await workoutAPI.saveWorkout('Swimming', trackerData);
      return response; // Already in { success, workout, achievements, message } format
    } catch (error) {
      console.error('Error saving swimming workout:', error);
      return {
        success: false,
        message: error.message || 'Failed to save swimming session',
      };
    }
  }

  // Override cleanup to clear rest timer
  cleanup() {
    super.cleanup();
    if (this.restInterval) {
      clearInterval(this.restInterval);
      this.restInterval = null;
    }
  }

  // Swimming-specific callback for rest updates
  onRestUpdate(timeRemaining) {
    // Override in hook to update UI
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// React Hook for using SwimmingTracker - FIXED VERSION
const useSwimmingTracker = (userId) => {
  const [tracker] = useState(() => new SwimmingTracker(userId));
  const [duration, setDuration] = useState(0);
  const [laps, setLaps] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [poolLength, setPoolLength] = useState(25);
  const [strokeType, setStrokeType] = useState('Freestyle');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  // Setup callbacks only once, no dependencies that change
  useEffect(() => {
    // Override callbacks for swimming-specific updates
    tracker.onDurationUpdate = (newDuration) => {
      setDuration(newDuration);
    };

    tracker.onRestUpdate = (timeRemaining) => {
      setRestTimeRemaining(timeRemaining);
    };

    // Override state change callbacks - store original methods to avoid infinite calls
    const originalStart = tracker.onStart || (() => {});
    tracker.onStart = () => {
      setIsActive(true);
      setIsPaused(false);
      if (typeof originalStart === 'function') {
        originalStart.call(tracker);
      }
    };

    const originalPause = tracker.onPause || (() => {});
    tracker.onPause = () => {
      setIsPaused(true);
      if (typeof originalPause === 'function') {
        originalPause.call(tracker);
      }
    };

    const originalResume = tracker.onResume || (() => {});
    tracker.onResume = () => {
      setIsPaused(false);
      if (typeof originalResume === 'function') {
        originalResume.call(tracker);
      }
    };

    const originalStop = tracker.onStop || (() => {});
    tracker.onStop = () => {
      setIsActive(false);
      setIsPaused(false);
      setIsResting(false);
      setRestTimeRemaining(0);
      if (typeof originalStop === 'function') {
        originalStop.call(tracker);
      }
    };

    return () => {
      tracker.cleanup();
    };
  }, []); // Empty dependency array - only run once

  const completeLap = useCallback((strokeCount) => {
    const lap = tracker.completeLap(strokeCount);
    if (lap) {
      // Update state immediately after lap completion
      setLaps([...tracker.laps]);
      setTotalDistance(tracker.totalDistance);
    }
    return lap;
  }, [tracker]);

  const startRest = useCallback((seconds) => {
    tracker.startRest(seconds);
    setIsResting(true);
    setRestTimeRemaining(seconds);
  }, [tracker]);

  const skipRest = useCallback(() => {
    tracker.skipRest();
    setIsResting(false);
    setRestTimeRemaining(0);
  }, [tracker]);

  const updatePoolLength = useCallback((length) => {
    tracker.setPoolLength(length);
    setPoolLength(length);
  }, [tracker]);

  const updateStrokeType = useCallback((stroke) => {
    tracker.setStrokeType(stroke);
    setStrokeType(stroke);
  }, [tracker]);

  // Memoized methods to prevent recreation
  const getSwimmingStats = useCallback(() => tracker.getSwimmingStats(), [tracker]);
  const formatTime = useCallback((seconds) => tracker.formatTime(seconds), [tracker]);
  const formatDuration = useCallback((seconds) => tracker.formatDuration(seconds), [tracker]);
  const saveWorkout = useCallback(async () => await tracker.saveWorkout(), [tracker]);

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
    formattedDuration: tracker.formatDuration(duration),
    completeLap,
    startRest,
    skipRest,
    updatePoolLength,
    updateStrokeType,
    getSwimmingStats,
    formatTime,
    formatDuration,
    // BaseTracker methods
    startTracking: useCallback(async () => await tracker.start(), [tracker]),
    pauseTracking: useCallback(() => tracker.pause(), [tracker]),
    resumeTracking: useCallback(() => tracker.resume(), [tracker]),
    stopTracking: useCallback(() => tracker.stop(), [tracker]),
    saveWorkout,
  };
};

export { useSwimmingTracker };
export default SwimmingTracker;