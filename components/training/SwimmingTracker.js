// components/training/SwimmingTracker.js
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';

// SwimmingTracker class that extends our BaseTracker concept
class SwimmingTracker {
  constructor(userId) {
    this.userId = userId;
    this.activityType = 'Swimming';
    
    // Base tracking state
    this.isActive = false;
    this.isPaused = false;
    this.duration = 0;
    this.startTime = null;
    
    // Swimming-specific data
    this.poolLength = 25; // meters
    this.strokeType = 'Freestyle';
    this.laps = [];
    this.totalDistance = 0;
    this.currentLapStartTime = null;
    
    // Rest tracking
    this.isResting = false;
    this.restTimeRemaining = 0;
    
    // Internal tracking
    this.timerInterval = null;
    this.restInterval = null;
  }

  async start() {
    if (this.isActive) return false;

    this.startTime = new Date();
    this.isActive = true;
    this.isPaused = false;
    this.currentLapStartTime = 0;
    
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
    this.isResting = false;
    
    return true;
  }

  // Swimming-specific methods
  setPoolLength(length) {
    this.poolLength = length;
  }

  setStrokeType(stroke) {
    this.strokeType = stroke;
  }

  completeLap(strokeCount = 0) {
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
    this.isResting = true;
    this.restTimeRemaining = seconds;
  }

  skipRest() {
    this.isResting = false;
    this.restTimeRemaining = 0;
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

  async saveWorkout() {
    try {
      const stats = this.getSwimmingStats();
      
      const workoutData = {
        id: `workout_${Date.now()}`,
        type: this.activityType,
        duration: this.duration,
        poolLength: this.poolLength,
        strokeType: this.strokeType,
        laps: this.laps,
        totalDistance: this.totalDistance,
        totalLaps: this.laps.length,
        stats: stats,
        calories: Math.floor(this.duration * 6), // Swimming calorie calculation
        date: new Date().toISOString(),
        userId: this.userId,
        enhanced: true,
      };

      // Save to local storage
      const existingWorkouts = JSON.parse(
        await AsyncStorage.getItem('workoutHistory') || '[]'
      );
      existingWorkouts.unshift(workoutData);
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(existingWorkouts));

      return workoutData;
    } catch (error) {
      console.error('Error saving swimming workout:', error);
      throw error;
    }
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

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// React Hook for using SwimmingTracker
export const useSwimmingTracker = (userId) => {
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
  
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);

  // Main timer effect
  useEffect(() => {
    if (tracker.isActive && !tracker.isPaused && !tracker.isResting) {
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
  }, [tracker.isActive, tracker.isPaused, tracker.isResting]);

  // Rest timer effect
  useEffect(() => {
    if (tracker.isResting && tracker.restTimeRemaining > 0) {
      restTimerRef.current = setInterval(() => {
        tracker.restTimeRemaining--;
        setRestTimeRemaining(tracker.restTimeRemaining);
        
        if (tracker.restTimeRemaining <= 0) {
          tracker.isResting = false;
          setIsResting(false);
          Vibration.vibrate(500);
          clearInterval(restTimerRef.current);
        }
      }, 1000);
    } else if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [tracker.isResting, tracker.restTimeRemaining]);

  // Update state when tracker changes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setLaps([...tracker.laps]);
      setTotalDistance(tracker.totalDistance);
      setPoolLength(tracker.poolLength);
      setStrokeType(tracker.strokeType);
      setIsActive(tracker.isActive);
      setIsPaused(tracker.isPaused);
      setIsResting(tracker.isResting);
      setRestTimeRemaining(tracker.restTimeRemaining);
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [tracker]);

  const completeLap = (strokeCount) => {
    const lap = tracker.completeLap(strokeCount);
    setLaps([...tracker.laps]);
    setTotalDistance(tracker.totalDistance);
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
    completeLap,
    startRest,
    skipRest,
    updatePoolLength,
    updateStrokeType,
    getSwimmingStats: () => tracker.getSwimmingStats(),
    formatTime: (seconds) => tracker.formatTime(seconds),
    formatDuration: (seconds) => tracker.formatDuration(seconds),
  };
};

export default SwimmingTracker;