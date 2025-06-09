import { useState, useEffect, useRef, useCallback } from 'react';
import { Vibration } from 'react-native';
import BaseTracker from './BaseTracker';

// SwimmingTracker class that extends BaseTracker
class SwimmingTracker extends BaseTracker {
  constructor(userId) {
    super('Swimming', userId);
    
    // CRITICAL FIX: Ensure userId is properly stored
    this.userId = userId;
    console.log('SwimmingTracker constructor - userId:', this.userId);
    
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
    
    // Intervals for set tracking
    this.intervals = [];
    this.restPeriods = [];
  }

  // Override start to initialize lap tracking
  async start() {
    try {
      console.log('SwimmingTracker start - userId before start:', this.userId);
      
      const started = await super.start();
      if (started) {
        this.currentLapStartTime = 0;
      }
      
      console.log('SwimmingTracker start - userId after start:', this.userId);
      return started;
    } catch (error) {
      console.error('Failed to start swimming tracker:', error);
      return false;
    }
  }

  // Override stop to clear rest timer
  stop() {
    console.log('SwimmingTracker stop - userId before stop:', this.userId);
    const stopped = super.stop();
    if (stopped) {
      this.isResting = false;
      this.restTimeRemaining = 0;
      if (this.restInterval) {
        clearInterval(this.restInterval);
        this.restInterval = null;
      }
    }
    console.log('SwimmingTracker stop - userId after stop:', this.userId);
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
    
    // Record rest period
    const restPeriod = {
      startTime: new Date().toISOString(),
      duration: seconds,
      lapNumber: this.laps.length,
    };
    this.restPeriods.push(restPeriod);
    
    this.restInterval = setInterval(() => {
      this.restTimeRemaining--;
      this.onRestUpdate && this.onRestUpdate(this.restTimeRemaining);
      
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

  // Start interval set
  startInterval(setType, laps, restTime = 30) {
    const interval = {
      id: `interval_${Date.now()}`,
      type: setType, // 'warmup', 'main', 'cooldown'
      targetLaps: laps,
      restTime: restTime,
      startTime: new Date().toISOString(),
      startLap: this.laps.length,
      completed: false,
    };
    
    this.intervals.push(interval);
    return interval;
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
        efficiency: 0,
      };
    }

    const avgLapTime = this.laps.reduce((sum, lap) => sum + lap.time, 0) / this.laps.length;
    const avgSwolf = this.laps.reduce((sum, lap) => sum + lap.swolf, 0) / this.laps.length;
    const avgStrokeRate = this.laps.reduce((sum, lap) => {
      return sum + (lap.strokeCount > 0 ? lap.strokeCount / (lap.time / 60) : 0);
    }, 0) / this.laps.length;
    const pace100m = avgLapTime * (100 / this.poolLength);
    const efficiency = avgSwolf > 0 ? 100 / avgSwolf : 0;

    return {
      avgLapTime,
      avgSwolf,
      avgStrokeRate,
      pace100m,
      totalLaps: this.laps.length,
      totalDistance: this.totalDistance,
      caloriesEstimate: this.calculateCalories(),
      efficiency,
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

  // CRITICAL FIX: Override prepareWorkoutData to include sessionId and structure correctly
  async prepareWorkoutData(sessionData) {
    console.log('SwimmingTracker prepareWorkoutData - userId at start:', this.userId);
    
    // Ensure we have a valid userId
    if (!this.userId) {
      console.error('ERROR: userId is null/undefined in prepareWorkoutData');
      throw new Error('User ID is required for workout data preparation');
    }

    const stats = this.getSwimmingStats();

    const workoutData = {
      // Core required fields
      type: 'Swimming',
      userId: this.userId,
      sessionId: this.sessionId,  // CRITICAL FIX: Add required sessionId
      startTime: this.startTime.toISOString(),
      endTime: this.endTime.toISOString(),
      duration: this.duration,
      calories: this.calculateCalories(),
      
      // Swimming-specific data
      swimming: {
        poolLength: this.poolLength || 25,
        distance: this.totalDistance || 0,
        strokeType: this.strokeType || 'Freestyle',
        laps: this.laps || [],
        intervals: this.intervals || [],
        technique: {
          averageStrokeRate: stats.avgStrokeRate || 0,
          averageSwolf: stats.avgSwolf || 0,
          efficiency: stats.efficiency || 0,
        },
        restPeriods: this.restPeriods || [],
      },
      
      // Optional fields
      name: `Swimming Session`,
      notes: '',
      privacy: 'public',
    };

    console.log('SwimmingTracker prepareWorkoutData - final userId:', workoutData.userId);
    console.log('SwimmingTracker prepareWorkoutData - workout data structure:', {
      type: workoutData.type,
      userId: workoutData.userId,
      sessionId: workoutData.sessionId,
      duration: workoutData.duration,
      totalDistance: workoutData.swimming.distance,
      totalLaps: workoutData.swimming.laps.length
    });

    return workoutData;
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
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// FIXED: React Hook for using SwimmingTracker with dynamic userId
const useSwimmingTracker = (userId) => {
  const [tracker, setTracker] = useState(null);
  const [duration, setDuration] = useState(0);
  const [laps, setLaps] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [poolLength, setPoolLength] = useState(25);
  const [strokeType, setStrokeType] = useState('Freestyle');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [intervals, setIntervals] = useState([]);

  // Create or update tracker when userId changes
  useEffect(() => {
    if (userId) {
      console.log('useSwimmingTracker - Creating/updating tracker with userId:', userId);
      const newTracker = new SwimmingTracker(userId);
      setTracker(newTracker);
      
      // Reset all state when creating new tracker
      setDuration(0);
      setLaps([]);
      setTotalDistance(0);
      setPoolLength(25);
      setStrokeType('Freestyle');
      setIsActive(false);
      setIsPaused(false);
      setIsResting(false);
      setRestTimeRemaining(0);
      setIntervals([]);
    }
  }, [userId]);

  useEffect(() => {
    if (!tracker) return;
    
    console.log('useSwimmingTracker useEffect - tracker userId:', tracker.userId);

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
      if (originalStart) originalStart.call(tracker);
    };

    const originalPause = tracker.onPause;
    tracker.onPause = () => {
      setIsPaused(true);
      if (originalPause) originalPause.call(tracker);
    };

    const originalResume = tracker.onResume;
    tracker.onResume = () => {
      setIsPaused(false);
      if (originalResume) originalResume.call(tracker);
    };

    const originalStop = tracker.onStop;
    tracker.onStop = () => {
      setIsActive(false);
      setIsPaused(false);
      setIsResting(false);
      setRestTimeRemaining(0);
      if (originalStop) originalStop.call(tracker);
    };

    return () => {
      if (tracker) {
        tracker.cleanup();
      }
    };
  }, [tracker]);

  // Update state when tracker changes
  useEffect(() => {
    if (!tracker) return;
    
    const updateInterval = setInterval(() => {
      if (tracker.isActive) {
        setLaps([...tracker.laps]);
        setTotalDistance(tracker.totalDistance);
        setPoolLength(tracker.poolLength);
        setStrokeType(tracker.strokeType);
        setIsResting(tracker.isResting);
        setRestTimeRemaining(tracker.restTimeRemaining);
        setIntervals([...tracker.intervals]);
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [tracker]);

  const completeLap = useCallback((strokeCount) => {
    if (!tracker) return null;
    const lap = tracker.completeLap(strokeCount);
    if (lap) {
      setLaps([...tracker.laps]);
      setTotalDistance(tracker.totalDistance);
    }
    return lap;
  }, [tracker]);

  const startRest = useCallback((seconds) => {
    if (!tracker) return;
    tracker.startRest(seconds);
    setIsResting(true);
    setRestTimeRemaining(seconds);
  }, [tracker]);

  const skipRest = useCallback(() => {
    if (!tracker) return;
    tracker.skipRest();
    setIsResting(false);
    setRestTimeRemaining(0);
  }, [tracker]);

  const updatePoolLength = useCallback((length) => {
    if (!tracker) return;
    tracker.setPoolLength(length);
    setPoolLength(length);
  }, [tracker]);

  const updateStrokeType = useCallback((stroke) => {
    if (!tracker) return;
    tracker.setStrokeType(stroke);
    setStrokeType(stroke);
  }, [tracker]);

  const startInterval = useCallback((setType, laps, restTime) => {
    if (!tracker) return null;
    return tracker.startInterval(setType, laps, restTime);
  }, [tracker]);

  // Return null functions if tracker not ready
  if (!tracker) {
    return {
      tracker: null,
      duration: 0,
      laps: [],
      totalDistance: 0,
      poolLength: 25,
      strokeType: 'Freestyle',
      isActive: false,
      isPaused: false,
      isResting: false,
      restTimeRemaining: 0,
      intervals: [],
      formattedDuration: '00:00',
      completeLap: () => null,
      startRest: () => null,
      skipRest: () => null,
      updatePoolLength: () => null,
      updateStrokeType: () => null,
      startInterval: () => null,
      getSwimmingStats: () => ({}),
      formatTime: () => '0:00',
      formatDuration: () => '00:00',
      startTracking: async () => false,
      pauseTracking: () => false,
      resumeTracking: () => false,
      stopTracking: () => false,
      saveWorkout: async () => ({ success: false, message: 'Tracker not ready' }),
    };
  }

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
    intervals,
    formattedDuration: tracker.formatDuration(duration),
    completeLap,
    startRest,
    skipRest,
    updatePoolLength,
    updateStrokeType,
    startInterval,
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