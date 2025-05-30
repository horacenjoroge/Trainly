// components/training/SwimmingTracker.js
import { useState, useEffect, useRef } from 'react';
import { Vibration } from 'react-native';
import BaseTracker from './BaseTracker';

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
      poolLength: this.poolLength,
      strokeType: this.strokeType,
      laps: this.laps,
      totalDistance: this.totalDistance,
      totalLaps: this.laps.length,
      stats: stats,
      enhanced: true,
      activitySubtype: 'Pool Swimming',
    };
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

// React Hook for using SwimmingTracker
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

  useEffect(() => {
    // Override callbacks for swimming-specific updates
    tracker.onDurationUpdate = (newDuration) => {
      setDuration(newDuration);
    };

    tracker.onRestUpdate = (timeRemaining) => {
      setRestTimeRemaining(timeRemaining);
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
      setIsResting(false);
      setRestTimeRemaining(0);
      originalStop.call(tracker);
    };

    return () => {
      tracker.cleanup();
    };
  }, [tracker]);

  // Update state when tracker changes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setLaps([...tracker.laps]);
      setTotalDistance(tracker.totalDistance);
      setPoolLength(tracker.poolLength);
      setStrokeType(tracker.strokeType);
      setIsResting(tracker.isResting);
      if (tracker.isResting) {
        setRestTimeRemaining(tracker.restTimeRemaining);
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [tracker]);

  const completeLap = (strokeCount) => {
    const lap = tracker.completeLap(strokeCount);
    if (lap) {
      setLaps([...tracker.laps]);
      setTotalDistance(tracker.totalDistance);
    }
    return lap;
  };

  const startRest = (seconds) => {
    tracker.startRest(seconds);
    setIsResting(true);
    setRestTimeRemaining(seconds);
  };

  const skipRest = () => {
    tracker.skipRest();
    setIsResting(false);
    setRestTimeRemaining(0);
  };

  const updatePoolLength = (length) => {
    tracker.setPoolLength(length);
    setPoolLength(length);
  };

  const updateStrokeType = (stroke) => {
    tracker.setStrokeType(stroke);
    setStrokeType(stroke);
  };

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
    getSwimmingStats: () => tracker.getSwimmingStats(),
    formatTime: (seconds) => tracker.formatTime(seconds),
    formatDuration: (seconds) => tracker.formatDuration(seconds),
    // BaseTracker methods
    startTracking: async () => await tracker.start(),
    pauseTracking: () => tracker.pause(),
    resumeTracking: () => tracker.resume(),
    stopTracking: () => tracker.stop(),
    saveWorkout: async () => await tracker.saveWorkout(),
  };
};

export { useSwimmingTracker };
export default SwimmingTracker;