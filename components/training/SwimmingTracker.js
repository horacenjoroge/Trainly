import { useState, useEffect, useRef } from 'react';
import { Vibration } from 'react-native';
import BaseTracker from './BaseTracker';
import { log, logError, logWarn } from '../../utils/logger';

// SwimmingTracker class that extends BaseTracker
class SwimmingTracker extends BaseTracker {
  constructor(userId) {
    super('Swimming', userId);
    
    this.userId = userId;
    log('SwimmingTracker constructor - userId:', this.userId);
    
    // Swimming-specific data
    this.poolLength = 25;
    this.strokeType = 'Freestyle';
    this.laps = [];
    this.totalDistance = 0;
    this.currentLapStartTime = null;
    
    // Rest tracking
    this.isResting = false;
    this.restTimeRemaining = 0;
    this.restInterval = null;
    
    this.intervals = [];
    this.restPeriods = [];
  }

  async start() {
    try {
      log('SwimmingTracker start - userId before start:', this.userId);
      const started = await super.start();
      if (started) {
        this.currentLapStartTime = 0;
      }
      log('SwimmingTracker start - userId after start:', this.userId);
      return started;
    } catch (error) {
      logError('Failed to start swimming tracker:', error);
      return false;
    }
  }

  stop() {
    log('SwimmingTracker stop - userId before stop:', this.userId);
    const stopped = super.stop();
    if (stopped) {
      this.isResting = false;
      this.restTimeRemaining = 0;
      if (this.restInterval) {
        clearInterval(this.restInterval);
        this.restInterval = null;
      }
    }
    log('SwimmingTracker stop - userId after stop:', this.userId);
    return stopped;
  }

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
    
    const restPeriod = {
      startTime: new Date().toISOString(),
      duration: seconds,
      lapNumber: this.laps.length,
    };
    this.restPeriods.push(restPeriod);
    
    this.restInterval = setInterval(() => {
      this.restTimeRemaining--;
      if (this.onRestUpdate) {
        this.onRestUpdate(this.restTimeRemaining);
      }
      
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

  calculateCalories() {
    const baseRate = 10;
    const intensityMultiplier = this.getIntensityMultiplier();
    return Math.round((this.duration / 60) * baseRate * intensityMultiplier);
  }

  getIntensityMultiplier() {
    // Avoid calling getSwimmingStats() here to prevent recursive loops.
    if (this.laps.length === 0) return 1.0;

    const totalSwolf = this.laps.reduce((sum, lap) => {
      const lapTime = lap.time || 0;
      const strokeCount = lap.strokeCount || 0;
      return sum + (lapTime + strokeCount);
    }, 0);

    const avgSwolf = totalSwolf / this.laps.length;
    if (avgSwolf < 30) return 1.3;
    if (avgSwolf < 40) return 1.1;
    return 1.0;
  }

  async prepareWorkoutData(sessionData) {
    log('SwimmingTracker prepareWorkoutData - userId at start:', this.userId);
    
    if (!this.userId) {
      logError('ERROR: userId is null/undefined in prepareWorkoutData');
      throw new Error('User ID is required for workout data preparation');
    }

    // Ensure we have a valid sessionId for backend uniqueness
    if (!this.sessionId) {
      const generatedSessionId = `swimming_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      logWarn('SwimmingTracker prepareWorkoutData - sessionId was null, generating:', generatedSessionId);
      this.sessionId = generatedSessionId;
    }

    // Ensure we have valid start/end times to avoid toISOString null errors
    if (!this.startTime) {
      logWarn('SwimmingTracker prepareWorkoutData - startTime was null, defaulting to now - duration');
      const now = new Date();
      // duration is in seconds; subtract from now as a best-effort estimate
      const safeStart = isFinite(this.duration) && this.duration > 0
        ? new Date(now.getTime() - this.duration * 1000)
        : now;
      this.startTime = safeStart;
    }

    if (!this.endTime) {
      logWarn('SwimmingTracker prepareWorkoutData - endTime was null, defaulting to now');
      this.endTime = new Date();
    }

    const stats = this.getSwimmingStats();

    const workoutData = {
      type: 'Swimming',
      userId: this.userId,
      sessionId: this.sessionId,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime.toISOString(),
      duration: this.duration,
      calories: this.calculateCalories(),
      
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
      
      name: `Swimming Session`,
      notes: '',
      privacy: 'public',
    };

    log('SwimmingTracker prepareWorkoutData - final userId:', workoutData.userId);
    return workoutData;
  }

  cleanup() {
    super.cleanup();
    if (this.restInterval) {
      clearInterval(this.restInterval);
      this.restInterval = null;
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// BULLETPROOF: Absolutely minimal hook to prevent any loops
const useSwimmingTracker = (userId) => {
  // Single tracker instance - never recreate
  const trackerRef = useRef(null);
  
  // State variables
  const [duration, setDuration] = useState(0);
  const [laps, setLaps] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [poolLength, setPoolLength] = useState(25);
  const [strokeType, setStrokeType] = useState('Freestyle');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  // Create tracker ONLY ONCE when userId first becomes available
  useEffect(() => {
    if (userId && !trackerRef.current) {
      log('useSwimmingTracker - Creating tracker with userId:', userId);
      trackerRef.current = new SwimmingTracker(userId);
      
      // Set up callbacks ONCE
      const tracker = trackerRef.current;
      
      // Use the new stable callback system from BaseTracker
      tracker.setDurationCallback((newDuration) => {
        setDuration(newDuration);
      });
      
      tracker.onStart = () => {
        setIsActive(true);
        setIsPaused(false);
      };

      tracker.onPause = () => {
        setIsPaused(true);
      };

      tracker.onResume = () => {
        setIsPaused(false);
      };

      tracker.onStop = () => {
        setIsActive(false);
        setIsPaused(false);
        setIsResting(false);
        setRestTimeRemaining(0);
      };

      tracker.onRestUpdate = (timeRemaining) => {
        setRestTimeRemaining(timeRemaining);
      };
    }
  }, [userId]); // Only run when userId changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackerRef.current) {
        trackerRef.current.cleanup();
      }
    };
  }, []);

  // Manual sync of non-timer state - STABLE
  useEffect(() => {
    if (!trackerRef.current) return;

    const syncInterval = setInterval(() => {
      const tracker = trackerRef.current;
      if (tracker && tracker.isActive) {
        setLaps([...tracker.laps]);
        setTotalDistance(tracker.totalDistance);
        setPoolLength(tracker.poolLength);
        setStrokeType(tracker.strokeType);
        setIsResting(tracker.isResting);
      }
    }, 1000);

    return () => clearInterval(syncInterval);
  }, [userId]); // Only depend on userId

  // Return methods - these are stable
  return {
    tracker: trackerRef.current,
    duration,
    laps,
    totalDistance,
    poolLength,
    strokeType,
    isActive,
    isPaused,
    isResting,
    restTimeRemaining,
    formattedDuration: trackerRef.current ? trackerRef.current.formatDuration(duration) : '00:00',
    
    // Methods - STABLE REFERENCES
    completeLap: (strokeCount) => {
      if (!trackerRef.current) return null;
      
      // CRITICAL FIX: Prevent multiple rapid calls during state updates
      const tracker = trackerRef.current;
      if (tracker._isCompletingLap) {
        logWarn('Lap completion already in progress, skipping...');
        return null;
      }
      
      try {
        tracker._isCompletingLap = true;
        const lap = tracker.completeLap(strokeCount);
        
        if (lap) {
          // Batch state updates to prevent multiple re-renders
          const currentLaps = [...tracker.laps];
          const currentDistance = tracker.totalDistance;
          
          // Use setTimeout to ensure state updates happen after current render cycle
          setTimeout(() => {
            setLaps(currentLaps);
            setTotalDistance(currentDistance);
            tracker._isCompletingLap = false;
          }, 0);
        } else {
          tracker._isCompletingLap = false;
        }
        
        return lap;
      } catch (error) {
        logError('Error in completeLap:', error);
        tracker._isCompletingLap = false;
        return null;
      }
    },
    
    startRest: (seconds) => {
      if (!trackerRef.current) return;
      trackerRef.current.startRest(seconds);
      setIsResting(true);
      setRestTimeRemaining(seconds);
    },
    
    skipRest: () => {
      if (!trackerRef.current) return;
      trackerRef.current.skipRest();
      setIsResting(false);
      setRestTimeRemaining(0);
    },
    
    updatePoolLength: (length) => {
      if (!trackerRef.current) return;
      trackerRef.current.setPoolLength(length);
      setPoolLength(length);
    },
    
    updateStrokeType: (stroke) => {
      if (!trackerRef.current) return;
      trackerRef.current.setStrokeType(stroke);
      setStrokeType(stroke);
    },
    
    getSwimmingStats: () => trackerRef.current ? trackerRef.current.getSwimmingStats() : {},
    formatTime: (seconds) => trackerRef.current ? trackerRef.current.formatTime(seconds) : '0:00',
    formatDuration: (seconds) => trackerRef.current ? trackerRef.current.formatDuration(seconds) : '00:00',
    
    startTracking: async () => trackerRef.current ? await trackerRef.current.start() : false,
    pauseTracking: () => trackerRef.current ? trackerRef.current.pause() : false,
    resumeTracking: () => trackerRef.current ? trackerRef.current.resume() : false,
    stopTracking: () => trackerRef.current ? trackerRef.current.stop() : false,
    saveWorkout: async () => trackerRef.current ? await trackerRef.current.saveWorkout() : { success: false, message: 'Tracker not ready' },
  };
};

export { useSwimmingTracker };
export default SwimmingTracker;