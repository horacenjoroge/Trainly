import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Vibration } from 'react-native';
import { workoutAPI } from '../../services/workoutAPI'; // Import workoutAPI
import { log, logError, logWarn } from '../../utils/logger';

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
    
    // CRITICAL FIX: Store callback reference to prevent recreating
    this.onDurationUpdateCallback = null;
  }

  // Generate unique session ID
  generateSessionId() {
    return `${this.activityType.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // FIXED: Start the tracking session with stable timer
  start() {
    if (this.isActive) return false;

    this.sessionId = this.generateSessionId();
    this.startTime = new Date();
    this.isActive = true;
    this.isPaused = false;
    
    // CRITICAL FIX: Only start timer if we have a stable callback
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.duration = Math.floor((new Date() - this.startTime) / 1000);
        
        // CRITICAL FIX: Only call callback if it exists and is stable
        if (this.onDurationUpdateCallback && typeof this.onDurationUpdateCallback === 'function') {
          // Use try-catch to prevent any callback errors from breaking the timer
          try {
            this.onDurationUpdateCallback(this.duration);
          } catch (error) {
            logWarn('Duration update callback error:', error);
          }
        }
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
    this.pauseStartTime = new Date();
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

  // CRITICAL FIX: Method to set stable duration callback
  setDurationCallback(callback) {
    this.onDurationUpdateCallback = callback;
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

  // FIXED: Auto-save session data - prevent infinite loops
  async autoSave() {
    if (!this.isActive) return;

    try {
      // CRITICAL FIX: Use basic session data for autosave, don't call enhanceSessionData
      // enhanceSessionData might trigger state updates that cause infinite loops
      const sessionData = this.getSessionData();
      
      // Save basic session data only - no enhanced data that might trigger re-renders
      await AsyncStorage.setItem(
        `active_session_${this.sessionId}`,
        JSON.stringify({
          ...sessionData,
          // Add basic calories calculation without calling methods that might cause loops
          calories: Math.round((this.duration / 60) * this.getActivityCalorieRate()),
          lastAutoSave: new Date().toISOString(),
        })
      );
      
      console.log(`Auto-saved ${this.activityType} session`);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  // FIXED: Save final workout data
  async saveWorkout() {
    let trackerData = null;
    
    try {
      // 1. Prepare workout data first
      const sessionData = this.getSessionData();
      trackerData = await this.prepareWorkoutData(sessionData);
      
      log('Saving workout:', trackerData);
      
      // 2. Try to save to API first
      const response = await workoutAPI.saveWorkout(this.activityType, trackerData);
      
      if (response.success) {
        // 3. API success - save to local storage
        const existingWorkouts = JSON.parse(
          await AsyncStorage.getItem('workoutHistory') || '[]'
        );
        existingWorkouts.unshift(trackerData);
        await AsyncStorage.setItem('workoutHistory', JSON.stringify(existingWorkouts));

        // 4. Clear active session
        await AsyncStorage.removeItem(`active_session_${this.sessionId}`);

        log(`${this.activityType} workout saved successfully to API and local storage`);
        
        return {
          success: true,
          workout: response.workout || trackerData,
          achievements: response.achievements || [],
          message: response.message || `${this.activityType} session saved successfully!`
        };
      } else {
        throw new Error(response.message || 'API save failed');
      }
      
    } catch (error) {
      logError(`Error saving ${this.activityType} workout to API:`, error);
      
      // Fallback: save locally and add to sync queue
      try {
        if (trackerData) {
          // Save to local storage as fallback
          const existingWorkouts = JSON.parse(
            await AsyncStorage.getItem('workoutHistory') || '[]'
          );
          existingWorkouts.unshift(trackerData);
          await AsyncStorage.setItem('workoutHistory', JSON.stringify(existingWorkouts));

          // Add to sync queue for later retry
          await this.addToSyncQueue(trackerData);

          // Clear active session
          await AsyncStorage.removeItem(`active_session_${this.sessionId}`);

          log(`${this.activityType} workout saved locally (offline mode)`);
          
          return {
            success: true,
            workout: trackerData,
            achievements: [],
            message: `${this.activityType} session saved locally. Will sync when online.`
          };
        } else {
          throw new Error('Failed to prepare workout data');
        }
      } catch (fallbackError) {
        logError('Fallback save failed:', fallbackError);
        return {
          success: false,
          message: `Failed to save ${this.activityType} session: ${fallbackError.message}`,
        };
      }
    }
  }

  // Add to sync queue for offline scenarios
  async addToSyncQueue(workoutData) {
    try {
      const syncQueue = JSON.parse(
        await AsyncStorage.getItem('workout_sync_queue') || '[]'
      );
      syncQueue.push({ 
        ...workoutData, 
        needsSync: true,
        syncAttempts: 0,
        lastSyncAttempt: new Date().toISOString()
      });
      await AsyncStorage.setItem('workout_sync_queue', JSON.stringify(syncQueue));
      log('Added workout to sync queue');
    } catch (error) {
      logError('Failed to add to sync queue:', error);
    }
  }

  // BONUS: Method to sync pending workouts
  static async syncPendingWorkouts() {
    try {
      const syncQueue = JSON.parse(
        await AsyncStorage.getItem('workout_sync_queue') || '[]'
      );
      
      if (syncQueue.length === 0) return { synced: 0, failed: 0 };
      
      let synced = 0;
      let failed = 0;
      const remainingQueue = [];
      
      for (const workout of syncQueue) {
        try {
          const response = await workoutAPI.saveWorkout(workout.type, workout);
          if (response.success) {
            synced++;
            log(`Synced pending workout: ${workout.type}`);
          } else {
            failed++;
            workout.syncAttempts = (workout.syncAttempts || 0) + 1;
            workout.lastSyncAttempt = new Date().toISOString();
            if (workout.syncAttempts < 3) {
              remainingQueue.push(workout);
            }
          }
        } catch (error) {
          failed++;
          workout.syncAttempts = (workout.syncAttempts || 0) + 1;
          workout.lastSyncAttempt = new Date().toISOString();
          if (workout.syncAttempts < 3) {
            remainingQueue.push(workout);
          }
          logError('Sync failed for workout:', error);
        }
      }
      
      // Update sync queue
      await AsyncStorage.setItem('workout_sync_queue', JSON.stringify(remainingQueue));
      
      return { synced, failed, remaining: remainingQueue.length };
    } catch (error) {
      logError('Error syncing pending workouts:', error);
      return { synced: 0, failed: 0, error: error.message };
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
      logError('Session restore failed:', error);
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
    log(`${this.activityType} session started`);
  }

  onPause() {
    log(`${this.activityType} session paused`);
    Vibration.vibrate(100);
  }

  onResume() {
    log(`${this.activityType} session resumed`);
  }

  onStop() {
    log(`${this.activityType} session stopped`);
    Vibration.vibrate([100, 100, 100]);
  }

  // DEPRECATED: Keep for backward compatibility but don't use
  onDurationUpdate(duration) {
    // This method is deprecated - use setDurationCallback instead
    logWarn('onDurationUpdate is deprecated, use setDurationCallback instead');
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
      sessionId: this.sessionId,  // CRITICAL FIX: Add required sessionId
      name: `${this.activityType} Session`,
      type: this.activityType,
      date: this.startTime?.toISOString(),
      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      completed: true,
      privacy: 'public',
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
    // Clear the callback reference
    this.onDurationUpdateCallback = null;
  }
}

// FIXED: React Hook for using BaseTracker with stable callbacks
export const useBaseTracker = (activityType, userId) => {
  const [tracker] = useState(() => new BaseTracker(activityType, userId));
  const [duration, setDuration] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Use useRef to create stable callback references
  const durationCallbackRef = useRef();
  const startCallbackRef = useRef();
  const pauseCallbackRef = useRef();
  const resumeCallbackRef = useRef();
  const stopCallbackRef = useRef();

  useEffect(() => {
    // Create stable callback references
    durationCallbackRef.current = (newDuration) => {
      setDuration(newDuration);
    };

    startCallbackRef.current = () => {
      setIsActive(true);
      setIsPaused(false);
      console.log(`${activityType} session started`);
    };

    pauseCallbackRef.current = () => {
      setIsPaused(true);
      log(`${activityType} session paused`);
    };

    resumeCallbackRef.current = () => {
      setIsPaused(false);
      log(`${activityType} session resumed`);
    };

    stopCallbackRef.current = () => {
      setIsActive(false);
      setIsPaused(false);
      log(`${activityType} session stopped`);
    };

    // CRITICAL FIX: Set the stable callback on the tracker
    tracker.setDurationCallback(durationCallbackRef.current);
    tracker.onStart = startCallbackRef.current;
    tracker.onPause = pauseCallbackRef.current;
    tracker.onResume = resumeCallbackRef.current;
    tracker.onStop = stopCallbackRef.current;

    return () => {
      tracker.cleanup();
    };
  }, []); // Empty dependency array - only run once

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