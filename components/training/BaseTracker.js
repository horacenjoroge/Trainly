// components/training/BaseTracker.js
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Vibration } from 'react-native';

class BaseTracker {
  constructor(activityType, userId) {
    this.activityType = activityType;
    this.userId = userId;
    this.startTime = null;
    this.endTime = null;
    this.duration = 0;
    this.isActive = false;
    this.isPaused = false;
    this.timerInterval = null;
    this.autosaveInterval = null;
    this.sessionId = null;
  }

  // Generate unique session ID
  generateSessionId() {
    return `${this.activityType.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start the tracking session
  start() {
    if (this.isActive) return false;

    this.sessionId = this.generateSessionId();
    this.startTime = new Date();
    this.isActive = true;
    this.isPaused = false;
    
    // Start timer
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.duration = Math.floor((new Date() - this.startTime) / 1000);
        this.onDurationUpdate(this.duration);
      }
    }, 1000);

    // Auto-save every 30 seconds
    this.autosaveInterval = setInterval(() => {
      this.autoSave();
    }, 30000);

    this.onStart();
    return true;
  }

  // Pause the session
  pause() {
    if (!this.isActive || this.isPaused) return false;

    this.isPaused = true;
    this.onPause();
    return true;
  }

  // Resume the session
  resume() {
    if (!this.isActive || !this.isPaused) return false;

    this.isPaused = false;
    // Adjust start time to account for pause duration
    const pausedDuration = new Date() - this.pauseStartTime;
    this.startTime = new Date(this.startTime.getTime() + pausedDuration);
    this.onResume();
    return true;
  }

  // Stop the session
  stop() {
    if (!this.isActive) return false;

    this.endTime = new Date();
    this.isActive = false;
    this.isPaused = false;

    // Clear intervals
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.autosaveInterval) {
      clearInterval(this.autosaveInterval);
      this.autosaveInterval = null;
    }

    this.onStop();
    return true;
  }

  // Get current session data
  getSessionData() {
    return {
      sessionId: this.sessionId,
      activityType: this.activityType,
      userId: this.userId,
      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      duration: this.duration,
      isActive: this.isActive,
      isPaused: this.isPaused,
      timestamp: new Date().toISOString(),
    };
  }

  // Auto-save session data
  async autoSave() {
    if (!this.isActive) return;

    try {
      const sessionData = this.getSessionData();
      const enhancedData = await this.enhanceSessionData(sessionData);
      
      await AsyncStorage.setItem(
        `active_session_${this.sessionId}`,
        JSON.stringify(enhancedData)
      );
      
      console.log(`Auto-saved ${this.activityType} session`);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  // Save final workout data
  async saveWorkout() {
    try {
      const sessionData = this.getSessionData();
      const workoutData = await this.prepareWorkoutData(sessionData);
      
      // Save to workout history
      const existingWorkouts = JSON.parse(
        await AsyncStorage.getItem('workoutHistory') || '[]'
      );
      existingWorkouts.unshift(workoutData);
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(existingWorkouts));

      // Clear active session
      await AsyncStorage.removeItem(`active_session_${this.sessionId}`);

      // Try to sync with backend
      await this.syncWorkoutToBackend(workoutData);

      return workoutData;
    } catch (error) {
      console.error('Save workout failed:', error);
      throw error;
    }
  }

  // Sync with backend API
  async syncWorkoutToBackend(workoutData) {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        console.log('Workout synced to backend');
        return await response.json();
      } else {
        throw new Error('Backend sync failed');
      }
    } catch (error) {
      console.error('Backend sync error:', error);
      // Add to sync queue for later
      await this.addToSyncQueue(workoutData);
    }
  }

  // Add to sync queue for offline scenarios
  async addToSyncQueue(workoutData) {
    try {
      const syncQueue = JSON.parse(
        await AsyncStorage.getItem('workout_sync_queue') || '[]'
      );
      syncQueue.push({ ...workoutData, needsSync: true });
      await AsyncStorage.setItem('workout_sync_queue', JSON.stringify(syncQueue));
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
    }
  }

  // Restore active session (app restart recovery)
  async restoreSession(sessionId) {
    try {
      const savedSession = await AsyncStorage.getItem(`active_session_${sessionId}`);
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        this.sessionId = sessionData.sessionId;
        this.startTime = new Date(sessionData.startTime);
        this.duration = sessionData.duration;
        this.isActive = sessionData.isActive;
        this.isPaused = sessionData.isPaused;

        if (this.isActive && !this.isPaused) {
          // Resume tracking
          this.start();
        }

        return sessionData;
      }
    } catch (error) {
      console.error('Session restore failed:', error);
    }
    return null;
  }

  // Format duration for display
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // Calculate calories (basic estimation)
  calculateCalories() {
    // Basic formula - can be overridden by specific trackers
    const baseRate = this.getActivityCalorieRate();
    return Math.round((this.duration / 60) * baseRate);
  }

  getActivityCalorieRate() {
    const rates = {
      'Running': 12, // calories per minute
      'Cycling': 8,
      'Swimming': 10,
      'Gym': 6,
    };
    return rates[this.activityType] || 6;
  }

  // Override methods for specific activity types
  onStart() {
    console.log(`${this.activityType} session started`);
  }

  onPause() {
    console.log(`${this.activityType} session paused`);
    Vibration.vibrate(100);
  }

  onResume() {
    console.log(`${this.activityType} session resumed`);
  }

  onStop() {
    console.log(`${this.activityType} session stopped`);
    Vibration.vibrate([100, 100, 100]);
  }

  onDurationUpdate(duration) {
    // Override in specific trackers for real-time updates
  }

  async enhanceSessionData(sessionData) {
    // Override in specific trackers to add activity-specific data
    return {
      ...sessionData,
      calories: this.calculateCalories(),
    };
  }

  async prepareWorkoutData(sessionData) {
    // Override in specific trackers to prepare final workout data
    const enhancedData = await this.enhanceSessionData(sessionData);
    return {
      ...enhancedData,
      id: `workout_${Date.now()}`,
      type: this.activityType,
      date: this.startTime?.toISOString(),
      completed: true,
    };
  }

  // Cleanup resources
  cleanup() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.autosaveInterval) {
      clearInterval(this.autosaveInterval);
    }
  }
}

// React Hook for using BaseTracker
export const useBaseTracker = (activityType, userId) => {
  const [tracker] = useState(() => new BaseTracker(activityType, userId));
  const [duration, setDuration] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Override duration update callback
    tracker.onDurationUpdate = (newDuration) => {
      setDuration(newDuration);
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

  const startTracking = () => tracker.start();
  const pauseTracking = () => tracker.pause();
  const resumeTracking = () => tracker.resume();
  const stopTracking = () => tracker.stop();
  const saveWorkout = () => tracker.saveWorkout();

  return {
    tracker,
    duration,
    isActive,
    isPaused,
    formattedDuration: tracker.formatDuration(duration),
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    saveWorkout,
  };
};

export default BaseTracker;